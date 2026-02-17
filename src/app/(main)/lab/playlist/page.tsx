"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Lyrics from "./Lyrics";
import FloatingWords from "./FloatingWords";

/* ─── YouTube IFrame API type shim ─── */
interface YTPlayer {
  loadVideoById(videoId: string): void;
  stopVideo(): void;
  getCurrentTime(): number;
  destroy(): void;
}
interface YTPlayerEvent {
  data: number;
}
interface YTPlayerConstructor {
  new (
    el: HTMLElement,
    opts: {
      videoId: string;
      playerVars?: Record<string, number>;
      events?: {
        onReady?: (e: YTPlayerEvent) => void;
        onStateChange?: (e: YTPlayerEvent) => void;
      };
    },
  ): YTPlayer;
}
interface YTNamespace {
  Player: YTPlayerConstructor;
  PlayerState: { ENDED: number };
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/* ─── Types ─── */
interface Track {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
}

/* ─── localStorage helpers ─── */
const STORAGE_KEY = "lab-playlist";

function loadPlaylist(): Track[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out any entries with missing/invalid videoId
    return parsed.filter(
      (t: Track) => t && typeof t.videoId === "string" && t.videoId.length >= 5,
    );
  } catch {
    return [];
  }
}

function savePlaylist(tracks: Track[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
}

/* ─── Component ─── */
export default function PlaylistPage() {
  /* search state */
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  /* autocomplete */
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  /* playlist state */
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);

  /* player ref for YouTube iframe API */
  const playerRef = useRef<YTPlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [playerKey, setPlayerKey] = useState(0);
  const ytReady = useRef(false);
  const playlistLenRef = useRef(0);
  const lyricsCacheRef = useRef<Record<string, { synced?: string; plain?: string } | null>>({});
  const lyricsCacheOrder = useRef<string[]>([]); // LRU order tracking
  const LYRICS_CACHE_MAX = 50;

  const currentTrack = currentIdx >= 0 ? playlist[currentIdx] : null;

  // Keep ref in sync so the YT callback always sees latest length
  playlistLenRef.current = playlist.length;

  /* ── Load playlist from localStorage on mount ── */
  useEffect(() => {
    const saved = loadPlaylist();
    if (saved.length) setPlaylist(saved);
  }, []);

  /* ── Persist playlist ── */
  useEffect(() => {
    savePlaylist(playlist);
  }, [playlist]);

  /* ── YouTube IFrame API 로드 + cleanup on unmount ── */
  useEffect(() => {
    if (window.YT) {
      ytReady.current = true;
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        ytReady.current = true;
      };
    }

    return () => {
      // Destroy player on unmount to prevent memory leak
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
    };
  }, []);

  /* ── Play a track ── */
  const playTrack = useCallback(
    (videoId: string) => {
      if (!videoId || typeof videoId !== "string" || videoId.length < 5) return;

      if (playerRef.current) {
        try {
          playerRef.current.loadVideoById(videoId);
        } catch {
          // Player not ready yet, ignore
        }
        return;
      }

      if (!ytReady.current || !window.YT || !playerContainerRef.current) return;

      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: { autoplay: 1, rel: 0 },
        events: {
          onStateChange: (e: YTPlayerEvent) => {
            if (e.data === window.YT!.PlayerState.ENDED) {
              setCurrentIdx((prev) => {
                const next = prev + 1;
                if (next < playlistLenRef.current) return next;
                return prev;
              });
            }
          },
        },
      });
    },
    [],
  );

  /* ── React to currentIdx change ── */
  useEffect(() => {
    if (currentTrack?.videoId) playTrack(currentTrack.videoId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  /* ── Search ── */
  async function searchWith(q: string, pageToken?: string) {
    if (!q.trim()) return;
    setSearching(true);
    setSearchError(null);
    setShowSuggestions(false);

    try {
      const params = new URLSearchParams({ q: q.trim() });
      if (pageToken) params.set("pageToken", pageToken);

      const res = await fetch(`/api/youtube/search?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setSearchError(data.error || `Error ${res.status}`);
        return;
      }

      if (pageToken) {
        setResults((prev) => {
          const seen = new Set(prev.map((t: Track) => t.videoId));
          const fresh = (data.items as Track[]).filter((t) => !seen.has(t.videoId));
          return [...prev, ...fresh];
        });
      } else {
        setResults(data.items ?? []);
      }
      setNextPageToken(data.nextPageToken ?? null);
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : "Network error");
    } finally {
      setSearching(false);
    }
  }

  function search(pageToken?: string) {
    searchWith(query, pageToken);
  }

  /* ── Destroy YouTube player completely ── */
  function destroyPlayer() {
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch {}
      playerRef.current = null;
    }
    setPlayerKey((k) => k + 1); // force fresh container div
  }

  /* ── Clear everything ── */
  function clearAll() {
    destroyPlayer();
    setPlaylist([]);
    setCurrentIdx(-1);
    lyricsCacheRef.current = {};
    lyricsCacheOrder.current = [];
  }

  /* ── Playlist actions ── */
  function addToPlaylist(track: Track) {
    if (playlist.some((t) => t.videoId === track.videoId)) return;
    setPlaylist((prev) => [...prev, track]);
  }

  function removeFromPlaylist(videoId: string) {
    delete lyricsCacheRef.current[videoId];

    const idx = playlist.findIndex((t) => t.videoId === videoId);
    if (idx === -1) return;

    const next = playlist.filter((_, i) => i !== idx);

    // Handle side effects BEFORE state updates (not inside setPlaylist updater)
    if (idx === currentIdx) {
      if (next.length === 0) {
        destroyPlayer();
        setCurrentIdx(-1);
      } else {
        setCurrentIdx(Math.min(idx, next.length - 1));
      }
    } else if (idx < currentIdx) {
      setCurrentIdx((p) => p - 1);
    }

    setPlaylist(next);
  }

  function playNow(track: Track) {
    const idx = playlist.findIndex((t) => t.videoId === track.videoId);
    if (idx >= 0) {
      setCurrentIdx(idx);
    } else {
      setPlaylist((prev) => {
        const next = [...prev, track];
        // Use queueMicrotask to ensure setCurrentIdx runs after playlist update
        queueMicrotask(() => setCurrentIdx(next.length - 1));
        return next;
      });
    }
  }

  /* ── Shared lyrics state ── */
  const [lyricsData, setLyricsData] = useState<{ synced?: string; plain?: string } | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);

  /* ── Get current playback time ── */
  const getTime = useCallback(
    () => (typeof playerRef.current?.getCurrentTime === "function" ? playerRef.current.getCurrentTime() : 0),
    [],
  );

  useEffect(() => {
    if (!currentTrack) {
      setLyricsData(null);
      return;
    }

    const vid = currentTrack.videoId;

    // Check cache first
    if (vid in lyricsCacheRef.current) {
      // Move to end of LRU order
      lyricsCacheOrder.current = lyricsCacheOrder.current.filter((k) => k !== vid);
      lyricsCacheOrder.current.push(vid);
      setLyricsData(lyricsCacheRef.current[vid]);
      setLyricsLoading(false);
      return;
    }

    const controller = new AbortController();
    setLyricsData(null);
    setLyricsLoading(true);

    const cleanArtist = (a: string) => {
      let s = a.replace(/\s*-\s*Topic$/i, "").replace(/VEVO$/i, "").replace(/Official$/i, "").trim();
      // Only split camelCase for long spaceless names (VEVO-style: "KendrickLamar" → "Kendrick Lamar")
      // Skip short names like "10CM", "pH-1", "1theK" which are intentional
      if (s && !s.includes(" ") && s.length >= 7) {
        s = s.replace(/([a-z]{2,})([A-Z])/g, "$1 $2")       // "KendrickLamar" → "Kendrick Lamar"
          .replace(/(\d)([A-Z][a-z]{2,})/g, "$1 $2");        // "21Savage" → "21 Savage" (not "10CM")
      }
      return s.replace(/\s+/g, " ").trim();
    };
    const cleanTitle = (t: string) =>
      t.replace(/\(official.*?\)/gi, "").replace(/\[official.*?\]/gi, "")
        .replace(/\(.*?mv\)/gi, "").replace(/\[.*?mv\]/gi, "")
        // "Official MV" / "M/V" without parens (K-pop: "BLACKPINK - 'DDU-DU DDU-DU' M/V")
        .replace(/\s+official\s+mv\b/gi, "")
        .replace(/\s+m\/v\s*$/gi, "")
        .replace(/\s+MV\s*$/gi, "")
        .replace(/official\s*(music\s*)?video/gi, "")
        .replace(/\(lyrics?\s*(video)?\)/gi, "").replace(/\[lyrics?\s*(video)?\]/gi, "")
        .replace(/lyrics?\s*video/gi, "")
        .replace(/\(가사.*?\)/gi, "").replace(/\[가사.*?\]/gi, "")
        .replace(/【.*?】/g, "")
        .replace(/\s*[-|]\s*$/, "").replace(/\s+/g, " ").trim();

    /** Add to LRU cache, evict oldest if over limit */
    const cacheSet = (key: string, value: { synced?: string; plain?: string } | null) => {
      lyricsCacheRef.current[key] = value;
      lyricsCacheOrder.current = lyricsCacheOrder.current.filter((k) => k !== key);
      lyricsCacheOrder.current.push(key);
      // Evict oldest entries if cache exceeds limit
      while (lyricsCacheOrder.current.length > LYRICS_CACHE_MAX) {
        const evict = lyricsCacheOrder.current.shift();
        if (evict) delete lyricsCacheRef.current[evict];
      }
    };

    const artist = cleanArtist(currentTrack.channel);
    const title = cleanTitle(currentTrack.title);
    // Build query: use title directly (it often already contains artist name like "Artist - Song")
    // so avoid duplicating artist in q parameter
    const titleLower = title.toLowerCase();
    const artistLower = artist.toLowerCase();
    const q = titleLower.includes(artistLower) ? title : `${artist} ${title}`;
    const params = new URLSearchParams({ q, artist, title });

    fetch(`/api/lyrics?${params}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (controller.signal.aborted) return;
        // Cache both found and not-found results to avoid re-fetching
        cacheSet(vid, data ?? null);
        setLyricsData(data);
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        // Non-abort error: cache as null so we don't retry endlessly
        cacheSet(vid, null);
        setLyricsData(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLyricsLoading(false);
      });

    return () => controller.abort();
  }, [currentTrack?.videoId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Autocomplete suggestions ── */
  function onQueryChange(val: string) {
    setQuery(val);
    clearTimeout(suggestTimer.current);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    suggestTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/youtube/suggest?q=${encodeURIComponent(val.trim())}`);
        const data: string[] = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 200);
  }

  function pickSuggestion(s: string) {
    setQuery(s);
    setSuggestions([]);
    setShowSuggestions(false);
    // trigger search
    setTimeout(() => {
      setQuery(s);
      searchWith(s);
    }, 0);
  }

  /* ── Close suggestions on outside click ── */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ── Decode HTML entities in titles ── */
  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  /* ── Render ── */
  return (
    <div className="pt-14 min-h-screen bg-[#fef9f3]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── Left: Search ─── */}
          <div className="lg:w-[360px] flex-shrink-0 order-2 lg:order-1">
            {/* Search bar */}
            <div ref={searchBoxRef} className="relative mb-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  search();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Search music..."
                  className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-200 bg-white/80 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#b5737a]/50 focus:ring-1 focus:ring-[#b5737a]/20 transition-colors"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-5 py-2.5 rounded-lg bg-[#b5737a] text-white text-sm hover:bg-[#a3636a] disabled:opacity-50 transition-colors"
                >
                  {searching ? "..." : "Search"}
                </button>
              </form>
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-20 left-0 right-12 mt-1 bg-white rounded-lg border border-neutral-200 shadow-lg overflow-hidden">
                  {suggestions.map((s, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => pickSuggestion(s)}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-[#b5737a]/5 transition-colors"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {searchError && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                {searchError}
              </div>
            )}

            {/* Results */}
            <div className="space-y-2">
              {results.map((track, i) => {
                const inPlaylist = playlist.some(
                  (t) => t.videoId === track.videoId,
                );
                return (
                  <div
                    key={`${track.videoId}-${i}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/60 transition-colors group"
                  >
                    <img
                      src={track.thumbnail}
                      alt=""
                      className="w-16 h-12 rounded object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-800 truncate">
                        {decodeHtml(track.title)}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {track.channel}
                      </p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => playNow(track)}
                        title="Play now"
                        className="w-8 h-8 rounded-full bg-[#b5737a] text-white text-xs flex items-center justify-center hover:bg-[#a3636a] transition-colors"
                      >
                        ▶
                      </button>
                      {!inPlaylist && (
                        <button
                          onClick={() => addToPlaylist(track)}
                          title="Add to playlist"
                          className="w-8 h-8 rounded-full border border-neutral-300 text-neutral-500 text-xs flex items-center justify-center hover:border-[#b5737a] hover:text-[#b5737a] transition-colors"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load more */}
            {nextPageToken && (
              <button
                onClick={() => search(nextPageToken)}
                disabled={searching}
                className="mt-4 w-full py-2 text-sm text-[#b5737a] border border-[#b5737a]/30 rounded-lg hover:bg-[#b5737a]/5 disabled:opacity-50 transition-colors"
              >
                {searching ? "Loading..." : "Load more"}
              </button>
            )}
          </div>

          {/* ─── Center: Floating Words ─── */}
          <div className="flex-1 min-w-0 order-3 lg:order-2 hidden lg:block">
            <div className="h-[calc(100vh-10rem)]">
              <FloatingWords
                key={currentTrack?.videoId ?? "empty"}
                lyricsData={lyricsData}
                loading={lyricsLoading}
              />
            </div>
          </div>

          {/* ─── Right: Player + Playlist ─── */}
          <div className="lg:w-[360px] flex-shrink-0 order-1 lg:order-3">
            {/* Player */}
            <div className="lg:sticky lg:top-20">
              <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden mb-4 relative">
                <div
                  key={playerKey}
                  ref={playerContainerRef}
                  className={`w-full h-full ${currentTrack ? "" : "hidden"}`}
                />
                {!currentTrack && (
                  <div className="w-full h-full flex items-center justify-center text-neutral-500 text-sm absolute inset-0">
                    Select a track to play
                  </div>
                )}
              </div>

              {currentTrack && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-neutral-800 truncate">
                    {decodeHtml(currentTrack.title)}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {currentTrack.channel}
                  </p>
                  <Lyrics
                    key={currentTrack.videoId}
                    lyricsData={lyricsData}
                    loading={lyricsLoading}
                    getTime={getTime}
                  />
                </div>
              )}

              {/* Playlist */}
              <div className="border border-neutral-200/80 rounded-xl bg-white/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">
                    Playlist
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">
                      {playlist.length} tracks
                    </span>
                    {playlist.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-[11px] text-neutral-400 hover:text-red-400 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                {playlist.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-neutral-400">
                    No tracks yet
                  </div>
                ) : (
                  <div className="max-h-[360px] overflow-y-auto">
                    {playlist.map((track, idx) => (
                      <div
                        key={`${track.videoId}-${idx}`}
                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors group ${
                          idx === currentIdx
                            ? "bg-[#b5737a]/10"
                            : "hover:bg-neutral-50"
                        }`}
                        onClick={() => setCurrentIdx(idx)}
                      >
                        <span className="w-5 text-xs text-neutral-400 text-right flex-shrink-0">
                          {idx === currentIdx ? "▶" : idx + 1}
                        </span>
                        <img
                          src={track.thumbnail}
                          alt=""
                          className="w-10 h-7 rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-neutral-800 truncate">
                            {decodeHtml(track.title)}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {track.channel}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromPlaylist(track.videoId);
                          }}
                          className="w-6 h-6 rounded-full text-neutral-400 hover:text-red-400 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
