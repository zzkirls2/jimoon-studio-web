"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface LyricsProps {
  lyricsData: { synced?: string; plain?: string } | null;
  loading: boolean;
  getTime: () => number;
}

interface LrcLine {
  time: number;
  text: string;
}

/* ── Parse LRC format → timestamped lines ── */
function parseLrc(lrc: string): LrcLine[] {
  const lines: LrcLine[] = [];
  for (const raw of lrc.split("\n")) {
    const m = raw.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
    if (m) {
      const time = parseInt(m[1]) * 60 + parseFloat(m[2]);
      const text = m[3].trim();
      if (text) lines.push({ time, text });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

export default function Lyrics({ lyricsData, loading, getTime }: LyricsProps) {
  const [lines, setLines] = useState<LrcLine[]>([]);
  const [plain, setPlain] = useState<string | null>(null);
  const [currentLine, setCurrentLine] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  /* translate state */
  const [showTranslation, setShowTranslation] = useState(false);
  const [translated, setTranslated] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);

  /* ── Process lyrics data from parent ── */
  useEffect(() => {
    setLines([]);
    setPlain(null);
    setCurrentLine(-1);
    setShowTranslation(false);
    setTranslated(null);

    if (!lyricsData) return;
    if (lyricsData.synced) {
      setLines(parseLrc(lyricsData.synced));
    } else if (lyricsData.plain) {
      setPlain(lyricsData.plain);
    }
  }, [lyricsData]);

  const allTexts =
    lines.length > 0
      ? lines.map((l) => l.text)
      : plain
        ? plain.split("\n").filter((l) => l.trim())
        : [];

  /* ── Sync playback time → current line ── */
  const sync = useCallback(() => {
    if (lines.length === 0) return;
    const t = getTime();
    let idx = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (t >= lines[i].time) {
        idx = i;
        break;
      }
    }
    setCurrentLine(idx);
  }, [lines, getTime]);

  useEffect(() => {
    if (lines.length === 0) return;
    intervalRef.current = setInterval(sync, 300);
    return () => clearInterval(intervalRef.current);
  }, [lines, sync]);

  /* ── Auto-scroll (within container only, never page) ── */
  useEffect(() => {
    if (showTranslation) return;
    if (currentLine < 0 || !containerRef.current) return;
    const container = containerRef.current;
    const el = container.children[currentLine] as HTMLElement;
    if (!el) return;
    const top = el.offsetTop - container.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
    container.scrollTo({ top, behavior: "smooth" });
  }, [currentLine, showTranslation]);

  /* ── Translate ── */
  async function doTranslate() {
    if (showTranslation) {
      setShowTranslation(false);
      return;
    }
    if (translated) {
      setShowTranslation(true);
      return;
    }
    setTranslating(true);
    setShowTranslation(true);
    try {
      const text = allTexts.join("\n");
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, to: "ko" }),
      });
      const data = await res.json();
      setTranslated(data.translated ?? "Translation failed");
    } catch {
      setTranslated("Translation failed");
    } finally {
      setTranslating(false);
    }
  }

  /* ── Render ── */
  if (loading) {
    return (
      <div className="py-2 text-[11px] text-neutral-400 text-center">
        Loading lyrics...
      </div>
    );
  }

  if (!lyricsData || allTexts.length === 0) {
    return (
      <div className="py-2 text-[11px] text-neutral-400 text-center">
        Lyrics not found
      </div>
    );
  }

  if (showTranslation) {
    return (
      <div className="mt-3">
        <div className="max-h-[90px] overflow-y-auto rounded-xl bg-white/40 border border-neutral-200/60 p-4">
          {translating ? (
            <p className="text-xs text-neutral-400 text-center">
              Translating...
            </p>
          ) : (
            <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
              {translated}
            </p>
          )}
        </div>
        <button
          onClick={doTranslate}
          className="mt-2 px-2.5 py-1 text-[11px] rounded-full bg-[#b5737a] text-white border border-[#b5737a] transition-colors"
        >
          Translate
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div
        ref={containerRef}
        className="max-h-[90px] overflow-y-auto rounded-xl bg-white/40 border border-neutral-200/60 p-4 space-y-1.5 scroll-smooth"
      >
        {allTexts.map((text, i) => (
          <p
            key={i}
            className={`text-xs transition-all duration-300 ${
              lines.length > 0 && i === currentLine
                ? "text-[#b5737a] font-medium"
                : "text-neutral-400"
            }`}
          >
            {text}
          </p>
        ))}
      </div>
      <button
        onClick={doTranslate}
        className="mt-2 px-2.5 py-1 text-[11px] rounded-full border border-neutral-200 text-neutral-500 hover:border-[#b5737a]/40 hover:text-[#b5737a] transition-colors"
      >
        Translate
      </button>
    </div>
  );
}
