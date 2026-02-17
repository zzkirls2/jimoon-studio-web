import { NextRequest, NextResponse } from "next/server";

interface LrcLibResult {
  syncedLyrics?: string;
  plainLyrics?: string;
}

type LyricsResult = { synced?: string; plain?: string };

const UA = { "User-Agent": "JimoonStudio/1.0" };

/* ── Helper: fetch with timeout ── */
async function fetchWithTimeout(url: string, ms: number, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

/* ── Parse LRCLIB response — prefer synced, then plain ── */
function parseLrcLib(data: unknown): LyricsResult | null {
  if (!Array.isArray(data) || data.length === 0) return null;
  // Prefer synced lyrics from any result
  for (const item of data as LrcLibResult[]) {
    if (item.syncedLyrics) return { synced: item.syncedLyrics };
  }
  // Fallback to plain lyrics
  for (const item of data as LrcLibResult[]) {
    if (item.plainLyrics) return { plain: item.plainLyrics };
  }
  return null;
}

/* ── LRCLIB search ── */
async function lrcLib(params: Record<string, string>): Promise<LyricsResult | null> {
  try {
    const res = await fetchWithTimeout(
      `https://lrclib.net/api/search?${new URLSearchParams(params)}`,
      4000,
      { headers: UA },
    );
    if (!res || !res.ok) return null;
    return parseLrcLib(await res.json());
  } catch {
    return null;
  }
}

/* ── lyrics.ovh ── */
async function lyricsOvh(artist: string, title: string): Promise<LyricsResult | null> {
  try {
    const res = await fetchWithTimeout(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
      6000,
    );
    if (!res || !res.ok) return null;
    const data = await res.json();
    const lyrics = data?.lyrics?.trim();
    if (!lyrics || lyrics.length < 30) return null;
    const cleaned = lyrics.replace(/^Paroles de la chanson.*?\n/i, "").trim();
    return { plain: cleaned };
  } catch {
    return null;
  }
}

/* ── Race: return first non-null result, don't wait for others ── */
function raceForResult(promises: Promise<LyricsResult | null>[]): Promise<LyricsResult | null> {
  return new Promise((resolve) => {
    let pending = promises.length;
    if (pending === 0) { resolve(null); return; }

    for (const p of promises) {
      p.then((result) => {
        if (result) resolve(result);
        else if (--pending === 0) resolve(null);
      }).catch(() => {
        if (--pending === 0) resolve(null);
      });
    }
  });
}

/* ── Clean title: remove artist name prefix like "Artist - Title" ── */
function cleanTrackTitle(title: string, artist: string, isLabel = false): string {
  let t = title;
  if (artist) {
    const escaped = artist.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefix = new RegExp(`^${escaped}\\s*[-–—]\\s*`, "i");
    t = t.replace(prefix, "");
    // Handle "FullArtist - Title" when channel-derived artist is partial
    // e.g., channel "ChainsmokersVEVO" → artist "Chainsmokers", title "The Chainsmokers - Closer"
    const dashMatch = t.match(/^(.+?)\s*[-–—]\s+(.+)$/);
    if (dashMatch) {
      const beforeDash = dashMatch[1].toLowerCase();
      const lowerArtist = artist.toLowerCase();
      // Match if the part before dash contains the artist name (or vice versa)
      if (beforeDash.includes(lowerArtist) || lowerArtist.includes(beforeDash.replace(/^the\s+/, ""))) {
        t = dashMatch[2];
      }
    }
  }
  // K-pop label titles only: extract quoted song name like 'Super Shy'
  // Only apply for label channels to avoid catching apostrophes in "It's", "can't", etc.
  if (isLabel) {
    const quoted = t.match(/[''\u2018\u2019]([^''\u2018\u2019]{2,})[''\u2018\u2019]/);
    if (quoted) {
      t = quoted[1];
    } else {
      // Strip Korean/Japanese parenthetical: "(뉴진스)", "(에스파)", etc.
      t = t.replace(/\s*\([^)]*[\uAC00-\uD7AF\u3040-\u309F\u30A0-\u30FF][^)]*\)/g, "");
    }
  } else {
    // For regular titles, just strip Korean parenthetical if present
    t = t.replace(/\s*\([^)]*[\uAC00-\uD7AF][^)]*\)/g, "");
  }
  // Strip "MV" / "M/V" suffix (K-pop: "aespa 'Supernova' MV")
  t = t.replace(/\s+MV\s*$/i, "").replace(/\s+M\/V\s*$/i, "");
  // Strip feat/ft. info for cleaner title matching
  t = t.replace(/\s*\(feat\..*?\)/gi, "").replace(/\s*\[feat\..*?\]/gi, "");
  t = t.replace(/\s*ft\.?\s+.*/i, "");
  return t.trim();
}

/* ── Extract real artist from K-pop/J-pop style titles ── */
function extractArtistFromTitle(title: string, channel: string): string {
  // Label channels that post multiple artists' content
  const labelChannels = /^(HYBE|SMTOWN|SM\s*ENTERTAINMENT|YG\s*(ENTERTAINMENT)?|JYP\s*(Entertainment)?|BIGHIT|1THE?K|Stone\s*Music|Kakao|CJ\s*ENM|CUBE\s*(ENTERTAINMENT)?|STARSHIP|PLEDIS|FNC|IST|ATTRAKT|LLOUD|XGALX|KQ\s*(Entertainment)?|THE\s*FIRST\s*TAKE|officialpsy|Mnet|Woollim|AOMG|P\s*NATION|BELIFT|dreamcatcher|RBW|WM|한국대중음악|1theK|S2|ADOR|Oddatelier)/i;
  if (!labelChannels.test(channel)) return "";

  // Pattern 1: English-starting artist followed by Korean chars, parens, quotes, or dashes
  // "aespa 에스파 'Supernova'" → "aespa"
  // "IVE 아이브 'LOVE DIVE'" → "IVE"
  // "(G)I-DLE (여자)아이들 'Super Lady'" → "(G)I-DLE"
  const m1 = title.match(/^(\(?[A-Za-z][A-Za-z0-9() .&!-]*?)(?:[\uAC00-\uD7AF]|\s*[\(（]|[''\u2018\u2019「『]|\s+[-–—]\s)/);
  if (m1) return m1[1].replace(/[-–—\s]+$/, "").trim();

  // Pattern 2: Korean-first → English name: "태연 TAEYEON 'To. X'" → "TAEYEON"
  const m2 = title.match(/^[\uAC00-\uD7AF]+\s+([A-Za-z][A-Za-z0-9. ]*?)(?:\s*[''\u2018\u2019「『]|\s+[-–—]\s)/);
  if (m2) return m2[1].replace(/[-–—\s]+$/, "").trim();

  return "";
}

/* ── Extract featured artist from title ── */
function extractFeatured(title: string): string {
  const m = title.match(/\(?feat\.?\s+(.+?)\)?$/i) || title.match(/\(?ft\.?\s+(.+?)\)?$/i);
  return m ? m[1].replace(/[()[\]]/g, "").trim() : "";
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const rawArtist = req.nextUrl.searchParams.get("artist") ?? "";
  const rawTitle = req.nextUrl.searchParams.get("title") ?? "";

  // For K-pop label channels, extract actual artist from title
  const kpopArtist = extractArtistFromTitle(rawTitle, rawArtist);
  const isLabel = !!kpopArtist;
  const artist = kpopArtist || rawArtist;
  const title = cleanTrackTitle(rawTitle, artist, isLabel);
  const featured = extractFeatured(rawTitle);

  const headers = { "Cache-Control": "no-store" };

  // Build multiple search strategies and race them ALL (including lyrics.ovh)
  const searches: Promise<LyricsResult | null>[] = [
    // Strategy 1: generic query search
    lrcLib({ q }),
    // Strategy 2: just cleaned title (most reliable for lrclib)
    lrcLib({ q: title }),
  ];

  if (artist && title) {
    // Strategy 3: structured artist + track search
    searches.push(lrcLib({ artist_name: artist, track_name: title }));
    // Strategy 4: artist + title as combined query
    searches.push(lrcLib({ q: `${artist} ${title}` }));
    // Strategy 5: lyrics.ovh in parallel (not sequential fallback)
    searches.push(lyricsOvh(artist, title));
  }

  // If there's a featured artist, try with main + featured
  if (featured && title) {
    searches.push(lrcLib({ q: `${artist} ${featured} ${title}` }));
  }

  // If K-pop artist was extracted, also try with original channel name
  if (kpopArtist && rawArtist && title) {
    searches.push(lrcLib({ q: `${rawArtist} ${title}` }));
  }

  // If artist contains mixed Korean/English, try with just the English part
  // e.g., "이지금 IU" → try "IU", "혁오 hyukoh" → try "hyukoh"
  const englishArtist = artist.replace(/[^\x00-\x7F]+/g, "").trim();
  if (englishArtist && englishArtist !== artist && title) {
    searches.push(lrcLib({ artist_name: englishArtist, track_name: title }));
    searches.push(lrcLib({ q: `${englishArtist} ${title}` }));
  }

  // If title contains "Artist - Song" pattern, try splitting and searching with extracted parts
  // e.g., "JISOO - 'FLOWER'" → try artist "JISOO", track "FLOWER"
  // e.g., "LUCY - 개화" → try artist "LUCY", track "개화"
  const dashSplit = title.match(/^(.+?)\s*[-–—]\s+(.+)$/);
  if (dashSplit) {
    const splitArtist = dashSplit[1].replace(/[''\u2018\u2019]/g, "").trim();
    const splitTrack = dashSplit[2].replace(/[''\u2018\u2019]/g, "").trim();
    if (splitArtist && splitTrack) {
      searches.push(lrcLib({ artist_name: splitArtist, track_name: splitTrack }));
      searches.push(lrcLib({ q: `${splitArtist} ${splitTrack}` }));
    }
  }

  // If title has mixed Korean/English like "사랑을 했다 (LOVE SCENARIO)", also try English part
  const engTitle = title.match(/\(([A-Za-z][\w\s,.'!?]+)\)/);
  if (engTitle && artist) {
    searches.push(lrcLib({ artist_name: artist, track_name: engTitle[1].trim() }));
  }

  // If K-pop title has "BTS 정국 (Jung Kook)" pattern, extract member name from parentheses
  const memberMatch = rawTitle.match(/\(([A-Za-z][\w\s]+)\)\s*[''\u2018\u2019]/);
  if (memberMatch && title) {
    const member = memberMatch[1].trim();
    searches.push(lrcLib({ artist_name: member, track_name: title }));
  }

  const result = await raceForResult(searches);
  if (result) {
    return NextResponse.json({ source: result.synced ? "lrclib" : "lyrics.ovh", ...result }, { headers });
  }

  return NextResponse.json({ error: "No lyrics found" }, {
    status: 404,
    headers: { "Cache-Control": "no-cache" },
  });
}
