type JsonSchema = Record<string, unknown>;

type GeminiInteraction = {
  output_text?: string;
  steps?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

export class GeminiUnavailableError extends Error {
  constructor(message = "Gemini is not configured") {
    super(message);
    this.name = "GeminiUnavailableError";
  }
}

export async function callGeminiStructured<T>({
  prompt,
  schema,
  tools,
}: {
  prompt: string;
  schema: JsonSchema;
  tools?: Array<{ type: "url_context" | "google_search" }>;
}): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiUnavailableError();

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        model: process.env.GEMINI_MODEL ?? "gemini-3.5-flash",
        input: prompt,
        ...(tools ? { tools } : {}),
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema,
        },
      }),
      signal: AbortSignal.timeout(20_000),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const interaction = (await response.json()) as GeminiInteraction;
  const output =
    interaction.output_text ??
    interaction.steps
      ?.flatMap((step) => step.content ?? [])
      .find((content) => content.type === "text")?.text;

  if (!output) throw new Error("Gemini returned no structured output");
  return JSON.parse(output) as T;
}

export function aiErrorResponse(error: unknown) {
  if (error instanceof GeminiUnavailableError) {
    return Response.json(
      { error: "AI enrichment is not configured yet.", code: "GEMINI_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  return Response.json(
    { error: "AI enrichment is temporarily unavailable. Please review the form manually." },
    { status: 502 },
  );
}
