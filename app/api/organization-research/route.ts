import { aiErrorResponse, callGeminiStructured } from "../../../lib/gemini";

type OrganizationResearch = {
  name: string;
  summary: string;
  mission: string;
  sectors: string[];
  audiences: string[];
  cultureSignals: string[];
  location: string;
  sourceNote: string;
};

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    summary: { type: "string" },
    mission: { type: "string" },
    sectors: { type: "array", items: { type: "string" }, maxItems: 5 },
    audiences: { type: "array", items: { type: "string" }, maxItems: 5 },
    cultureSignals: { type: "array", items: { type: "string" }, maxItems: 5 },
    location: { type: "string" },
    sourceNote: { type: "string" },
  },
  required: ["name", "summary", "mission", "sectors", "audiences", "cultureSignals", "location", "sourceNote"],
};

function isSafePublicUrl(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (!["http:", "https:"].includes(url.protocol)) return false;
    if (host === "localhost" || host.endsWith(".local") || host === "0.0.0.0" || host === "127.0.0.1" || host === "::1") return false;
    if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { website?: string };
    const website = body.website?.trim() ?? "";
    if (!isSafePublicUrl(website)) {
      return Response.json({ error: "Enter a publicly accessible organization website." }, { status: 400 });
    }

    const result = await callGeminiStructured<OrganizationResearch>({
      schema,
      tools: [{ type: "url_context" }],
      prompt: `Review only the public information at ${website}. Prepare an editable organization profile for a youth opportunity network. Do not infer protected traits, finances, reputation, safety, or verification status. If information is absent, use an empty string or empty list. sourceNote should briefly explain that the draft came from the supplied public website and requires employer confirmation.`,
    });

    return Response.json({ ...result, website, source: "gemini-url-context" });
  } catch (error) {
    return aiErrorResponse(error);
  }
}
