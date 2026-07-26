import { aiErrorResponse, callGeminiStructured } from "../../../lib/gemini";

type OpportunityExtraction = {
  title: string;
  type: string;
  date: string;
  commitment: string;
  location: string;
  format: string;
  ageRange: string;
  supervision: string;
  skills: string;
  impact: string;
  prayerSpace: string;
  prayerBreaks: string;
  halalFood: string;
  urgentNeed: string;
  missingFields: string[];
  confidence: number;
};

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    type: { type: "string", enum: ["Internship", "Volunteer", "Mentorship"] },
    date: { type: "string" },
    commitment: { type: "string" },
    location: { type: "string" },
    format: { type: "string", enum: ["In person", "Remote", "Hybrid"] },
    ageRange: { type: "string" },
    supervision: { type: "string" },
    skills: { type: "string" },
    impact: { type: "string" },
    prayerSpace: { type: "string" },
    prayerBreaks: { type: "string" },
    halalFood: { type: "string" },
    urgentNeed: { type: "string", enum: ["No", "Yes — immediate need"] },
    missingFields: { type: "array", items: { type: "string" } },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["title", "type", "date", "commitment", "location", "format", "ageRange", "supervision", "skills", "impact", "prayerSpace", "prayerBreaks", "halalFood", "urgentNeed", "missingFields", "confidence"],
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { description?: string; organizationContext?: string };
    const description = body.description?.trim() ?? "";
    if (description.length < 20 || description.length > 6000) {
      return Response.json({ error: "Please provide between 20 and 6,000 characters." }, { status: 400 });
    }

    const result = await callGeminiStructured<OpportunityExtraction>({
      schema,
      prompt: `Structure this rough youth opportunity into an editable listing. Never invent a date, age, location, supervision plan, commitment, eligibility requirement, prayer accommodation, food accommodation, or urgency. Use an empty string and list the field in missingFields when it is unclear. For urgentNeed, use "Yes — immediate need" only when the description clearly asks for help today, within 48 hours, or in an emergency; otherwise use "No". Keep the title welcoming and specific. Confidence must reflect the supplied evidence. Organization context: ${body.organizationContext?.slice(0, 1200) || "Not supplied"}.\n\nOpportunity description:\n${description}`,
    });

    return Response.json({ ...result, source: "gemini" });
  } catch (error) {
    return aiErrorResponse(error);
  }
}
