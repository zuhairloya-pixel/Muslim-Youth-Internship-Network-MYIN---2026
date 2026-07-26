const keywordMap: Record<string, string> = {
  engineering: "engineering consultant", technology: "office", tech: "office",
  software: "software company", coding: "software company", "computer science": "software company",
  architecture: "architect", marketing: "advertising", business: "office", finance: "bank",
  accounting: "firm", medical: "clinic", healthcare: "hospital", "pre-med": "hospital",
  law: "court", legal: "court", education: "school", teaching: "school",
};

type NominatimResult = { lat: string; lon: string; display_name: string; type: string };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get("zip")?.trim() ?? "";
  const field = searchParams.get("field")?.trim() ?? "";
  if (!/^\d{5}$/.test(zip)) return Response.json({ error: "Enter a valid five-digit U.S. ZIP code." }, { status: 400 });
  if (!field) return Response.json({ error: "Add a career field to scan the map." }, { status: 400 });

  const headers = { "User-Agent": "MYIN-hackathon-demo/1.0 (community opportunity discovery)" };
  const base = "https://nominatim.openstreetmap.org/search";
  try {
    const zipResponse = await fetch(`${base}?${new URLSearchParams({ q: `${zip} USA`, format: "json", limit: "1" })}`, { headers });
    if (!zipResponse.ok) throw new Error("Map service is temporarily unavailable.");
    const zipMatches = await zipResponse.json() as NominatimResult[];
    if (!zipMatches.length) return Response.json({ error: "ZIP code not found. Try another U.S. ZIP code." }, { status: 404 });
    const lat = Number(zipMatches[0].lat); const lon = Number(zipMatches[0].lon); const offset = 0.18;
    const query = keywordMap[field.toLowerCase()] || field;
    const params = new URLSearchParams({ q: query, format: "json", limit: "10", viewbox: `${lon - offset},${lat + offset},${lon + offset},${lat - offset}`, bounded: "1" });
    const placeResponse = await fetch(`${base}?${params}`, { headers });
    if (!placeResponse.ok) throw new Error("Map search is temporarily unavailable.");
    const places = await placeResponse.json() as NominatimResult[];
    return Response.json({ center: { lat, lon }, results: places.map((place) => ({ name: place.display_name, type: place.type, lat: Number(place.lat), lon: Number(place.lon) })) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Map search could not be completed." }, { status: 502 });
  }
}
