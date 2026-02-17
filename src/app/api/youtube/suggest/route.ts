import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(q)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    );
    const data = await res.json();
    // Format: ["query", ["suggestion1", "suggestion2", ...]]
    const suggestions: string[] = Array.isArray(data[1]) ? data[1].slice(0, 6) : [];
    return NextResponse.json(suggestions, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch {
    return NextResponse.json([]);
  }
}
