import { NextResponse } from "next/server";

const schema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" }, type: { type: "STRING" }, description: { type: "STRING" },
    skills: { type: "ARRAY", items: { type: "STRING" } }, interests: { type: "ARRAY", items: { type: "STRING" } },
    date: { type: "STRING" }, commitment: { type: "STRING" }, location: { type: "STRING" }, format: { type: "STRING" },
    ageRange: { type: "STRING" }, supervision: { type: "STRING" }, deadline: { type: "STRING" }, impact: { type: "STRING" },
    missingFields: { type: "ARRAY", items: { type: "STRING" } }, confidence: { type: "NUMBER" },
  },
  required: ["title", "type", "description", "skills", "missingFields"],
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { description?: unknown } | null;
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  if (!description) return NextResponse.json({ error: "Add an opportunity description first." }, { status: 400 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "AI extraction is not configured. You can still enter the listing manually." }, { status: 503 });
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: `Structure only this organization opportunity description. Do not infer missing facts. Return the requested JSON draft.\n\n${description}` }] }], generationConfig: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.1 } }),
    });
    if (!response.ok) throw new Error("Gemini request failed");
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini returned no draft");
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({ error: "We couldn’t structure that listing right now. Your description is still here; please review it manually or try again." }, { status: 502 });
  }
}
