import { z } from "zod";

import {
  extractOpportunity,
  GeminiConfigurationError,
  GeminiRateLimitError,
  GeminiUpstreamError,
  type OpportunityExtractionResult,
} from "@/lib/opportunity-extraction";

const requestSchema = z
  .object({
    description: z.string().trim().min(1).max(5_000),
  })
  .strict();

type Extractor = (description: string) => Promise<OpportunityExtractionResult>;

type ErrorCode =
  | "INVALID_INPUT"
  | "INVALID_ORIGIN"
  | "NOT_CONFIGURED"
  | "RATE_LIMITED"
  | "UPSTREAM_ERROR";

const responseHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders,
  });
}

function errorResponse(code: ErrorCode, message: string, status: number) {
  return json({ error: { code, message } }, status);
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function createPostHandler(extractor: Extractor = extractOpportunity) {
  return async function POST(request: Request): Promise<Response> {
    if (!isSameOrigin(request)) {
      return errorResponse(
        "INVALID_ORIGIN",
        "This extraction request must come from MYIN.",
        400,
      );
    }

    if (!request.headers.get("content-type")?.includes("application/json")) {
      return errorResponse(
        "INVALID_INPUT",
        "Send a JSON opportunity description.",
        400,
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(
        "INVALID_INPUT",
        "Send a valid JSON opportunity description.",
        400,
      );
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        "INVALID_INPUT",
        "Enter an opportunity description between 1 and 5,000 characters.",
        400,
      );
    }

    try {
      return json(await extractor(parsed.data.description));
    } catch (error) {
      if (error instanceof GeminiConfigurationError) {
        return errorResponse(
          "NOT_CONFIGURED",
          "Gemini extraction is not configured yet.",
          503,
        );
      }

      if (error instanceof GeminiRateLimitError) {
        return errorResponse(
          "RATE_LIMITED",
          "Gemini is busy right now. Please wait a moment and try again.",
          429,
        );
      }

      if (error instanceof GeminiUpstreamError) {
        return errorResponse(
          "UPSTREAM_ERROR",
          "MYIN could not extract this opportunity. Please try again.",
          502,
        );
      }

      return errorResponse(
        "UPSTREAM_ERROR",
        "MYIN could not extract this opportunity. Please try again.",
        502,
      );
    }
  };
}

export const POST = createPostHandler();
