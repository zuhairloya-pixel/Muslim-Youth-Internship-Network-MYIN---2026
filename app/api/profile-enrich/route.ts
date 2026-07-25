import { aiErrorResponse, callGeminiStructured } from "../../../lib/gemini";

type ProfileEnrichment = {
  summary: string;
  skills: string[];
  interests: string[];
  causes: string[];
  workStyle: string;
};

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string", description: "One encouraging sentence grounded only in the student's text." },
    skills: { type: "array", items: { type: "string" }, maxItems: 5 },
    interests: { type: "array", items: { type: "string" }, maxItems: 4 },
    causes: { type: "array", items: { type: "string" }, maxItems: 3 },
    workStyle: { type: "string" },
  },
  required: ["summary", "skills", "interests", "causes", "workStyle"],
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { narrative?: string };
    const narrative = body.narrative?.trim() ?? "";
    if (narrative.length < 20 || narrative.length > 2500) {
      return Response.json({ error: "Please share between 20 and 2,500 characters." }, { status: 400 });
    }

    const result = await callGeminiStructured<ProfileEnrichment>({
      schema,
      prompt: `You help a youth opportunity platform turn a student's voluntary free-text story into editable profile suggestions. Extract only evidence present in the text. Do not infer religion, ethnicity, health, disability, finances, politics, family status, or other sensitive traits. Use short, student-friendly labels. The result is a draft the student must approve.\n\nStudent story:\n${narrative}`,
    });

    return Response.json({ ...result, source: "gemini" });
  } catch (error) {
    return aiErrorResponse(error);
  }
}
