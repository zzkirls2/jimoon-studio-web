"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ─── YouTube IFrame API type shim ─── */
interface YTPlayer {
  loadVideoById(videoId: string): void;
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
    return raw ? JSON.parse(raw) : [];
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

  /* playlist state */
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);

  /* player ref for YouTube iframe API */
  const playerRef = useRef<YTPlayer | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const ytReady = useRef(false);

  const currentTrack = currentIdx >= 0 ? playlist[currentIdx] : null;

  /* ── Load playlist from localStorage on mount ── */
  useEffect(() => {
    const saved = loadPlaylist();
    if (saved.length) setPlaylist(saved);
  }, []);

  /* ── Persist playlist ── */
  useEffect(() => {
    savePlaylist(playlist);
  }, [playlist]);

  /* ── YouTube IFrame API 로드 ── */
  useEffect(() => {
    if (window.YT) {
      ytReady.current = true;
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      ytReady.current = true;
    };
  }, []);

  /* ── Play a track ── */
  const playTrack = useCallback(
    (videoId: string) => {
      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId);
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
                if (next < playlist.length) return next;
                return prev;
              });
            }
          },
        },
      });
    },
    [playlist.length],
  );

  /* ── React to currentIdx change ── */
  useEffect(() => {
    if (currentTrack) playTrack(currentTrack.videoId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  /* ── Search ── */
  async function search(pageToken?: string) {
    const q = query.trim();
    if (!q) return;
    setSearching(true);

    try {
      const params = new URLSearchParams({ q });
      if (pageToken) params.set("pageToken", pageToken);

      const res = await fetch(`/api/youtube/search?${params}`);
      const data = await res.json();

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
    } finally {
      setSearching(false);
    }
  }

  /* ── Playlist actions ── */
  function addToPlaylist(track: Track) {
    if (playlist.some((t) => t.videoId === track.videoId)) return;
    setPlaylist((prev) => [...prev, track]);
  }

  function removeFromPlaylist(videoId: string) {
    setPlaylist((prev) => {
      const idx = prev.findIndex((t) => t.videoId === videoId);
      if (idx === -1) return prev;

      const next = prev.filter((_, i) => i !== idx);

      if (idx === currentIdx) {
        // 현재 재생 중인 곡 삭제 → 다음 곡 또는 정지
        if (next.length === 0) setCurrentIdx(-1);
        else setCurrentIdx(Math.min(idx, next.length - 1));
      } else if (idx < currentIdx) {
        setCurrentIdx((p) => p - 1);
      }

      return next;
    });
  }

  function playNow(track: Track) {
    const idx = playlist.findIndex((t) => t.videoId === track.videoId);
    if (idx >= 0) {
      setCurrentIdx(idx);
    } else {
      setPlaylist((prev) => [...prev, track]);
      setCurrentIdx(playlist.length); // will be at the end after push
    }
  }

  /* ── Decode HTML entities in titles ── */
  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  /* ── Render ── */
  return (
    <div className="pt-14 min-h-screen bg-[#fef9f3]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-light tracking-wide text-neutral-800 mb-6">
          Playlist
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ─── Left: Search ─── */}
          <div className="flex-1 min-w-0 order-2 lg:order-1">
            {/* Search bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                search();
              }}
              className="flex gap-2 mb-6"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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

            {/* Results */}
            <div className="space-y-2">
              {results.map((track) => {
                const inPlaylist = playlist.some(
                  (t) => t.videoId === track.videoId,
                );
                return (
                  <div
                    key={track.videoId}
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

          {/* ─── Right: Player + Playlist ─── */}
          <div className="lg:w-[420px] flex-shrink-0 order-1 lg:order-2">
            {/* Player */}
            <div className="lg:sticky lg:top-20">
              <div className="aspect-video bg-neutral-900 rounded-xl overflow-hidden mb-4 relative">
                <div
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
                </div>
              )}

              {/* Playlist */}
              <div className="border border-neutral-200/80 rounded-xl bg-white/50 overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">
                    Playlist
                  </span>
                  <span className="text-xs text-neutral-400">
                    {playlist.length} tracks
                  </span>
                </div>

                {playlist.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-neutral-400">
                    No tracks yet
                  </div>
                ) : (
                  <div className="max-h-[360px] overflow-y-auto">
                    {playlist.map((track, idx) => (
                      <div
                        key={track.videoId}
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
