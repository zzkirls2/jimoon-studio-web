"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface FloatingWordsProps {
  lyricsData: { synced?: string; plain?: string } | null;
  loading: boolean;
}

/* ── Seed-based pseudo-random for stable positions ── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface WordItem {
  id: number;
  text: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

/* ── Shakespeare anagram colors ── */
const ANAGRAM_COLORS = [
  "#7B68AE", // royal purple — royalty, theater curtains
  "#C49A6C", // warm gold — Globe Theatre, Elizabethan era
  "#B5737A", // burgundy — passion, Rose Theatre
  "#6B9B7D", // sage green — "green-eyed monster", forest comedies
  "#5D7A99", // twilight blue — night scenes, melancholy
  "#C47A5A", // warm copper — stage candlelight
  "#8B6DAE", // soft violet — theatrical mystery
];

export default function FloatingWords({ lyricsData, loading }: FloatingWordsProps) {
  const [allWords, setAllWords] = useState<string[]>([]);
  const [composed, setComposed] = useState<string[]>([]);
  const [caught, setCaught] = useState<Set<number>>(new Set());
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Extract words from lyrics data ── */
  useEffect(() => {
    setAllWords([]);
    setComposed([]);
    setCaught(new Set());
    setTranslatedText(null);

    if (!lyricsData) return;
    const raw = lyricsData.synced || lyricsData.plain || "";

    // Strip LRC timestamps
    const text = raw.replace(/\[\d+:\d+(?:\.\d+)?\]/g, "");

    // Split into words, filter noise
    const words = text
      .split(/[\s\n,.()\[\]{}!?;:"']+/)
      .map((w: string) => w.trim())
      .filter((w: string) => w.length > 1)
      .filter((w: string) => !/^\d+$/.test(w));

    setAllWords(words.slice(0, 80));
  }, [lyricsData]);

  /* ── Build word items with stable positions ── */
  const wordItems: WordItem[] = useMemo(() => {
    const rand = seededRandom(42);
    return allWords.map((text, i) => ({
      id: i,
      text,
      x: 5 + rand() * 80,
      y: 5 + rand() * 75,
      size: 11 + Math.floor(rand() * 8),
      duration: 8 + rand() * 12,
      delay: rand() * -20,
    }));
  }, [allWords]);

  /* ── Catch a word ── */
  function catchWord(item: WordItem) {
    if (caught.has(item.id)) return;
    setCaught((prev) => new Set(prev).add(item.id));
    setComposed((prev) => [...prev, item.text]);
    setTranslatedText(null);
  }

  /* ── Remove word from composition ── */
  function removeFromComposed(idx: number) {
    setComposed((prev) => prev.filter((_, i) => i !== idx));
    setTranslatedText(null);
  }

  /* ── Clear composition ── */
  function clearComposed() {
    setComposed([]);
    setCaught(new Set());
    setTranslatedText(null);
  }

  /* ── Translate composition ── */
  async function translateComposed() {
    if (isTranslating) return;
    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: composed.join(" "), to: "ko" }),
      });
      const data = await res.json();
      setTranslatedText(data.translated ?? "Translation failed");
    } catch {
      setTranslatedText("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  }

  /* ── Shakespeare anagram phrases for idle state ── */
  const anagramPhrases = useMemo(() => {
    const items = [
      { text: "William Shakespeare",       x: 60, y: 25 },
      { text: "We all make his praise",    x: 38, y: 10 },
      { text: "I am a weakish speller",    x: 2,  y: 32 },
      { text: "I'll make a wise phrase",   x: 68, y: 48 },
      { text: "He as me, will sparke ai",  x: 3,  y: 68 },
      { text: "He's like a lamp, I swear", x: 35, y: 80 },
      { text: "Hear me as I will speak",   x: 18, y: 88 },
    ];
    const rand = seededRandom(777);
    return items.map((item, i) => ({
      id: i,
      text: item.text,
      color: ANAGRAM_COLORS[i],
      x: item.x,
      y: item.y,
      size: 13 + Math.floor(rand() * 4),
      duration: 14 + rand() * 8,
      delay: rand() * -12,
    }));
  }, []);

  if (!lyricsData && !loading) {
    return (
      <div className="relative h-full rounded-xl bg-gradient-to-b from-white/30 to-white/10 border border-neutral-200/40 overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes floatWord {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(6px, -10px) rotate(0.5deg); }
            50% { transform: translate(-3px, -18px) rotate(-0.5deg); }
            75% { transform: translate(-8px, -6px) rotate(0.3deg); }
          }
          @keyframes ghostShake {
            0%, 100% { transform: translate(0, 0); }
            20% { transform: translate(-0.3px, 0.3px); }
            40% { transform: translate(0.5px, -0.3px); }
            60% { transform: translate(-0.4px, 0.2px); }
            80% { transform: translate(0.3px, -0.4px); }
          }
        `}} />

        {/* Anagram phrases */}
        {anagramPhrases.map((item) => (
          <span
            key={item.id}
            className="absolute select-none italic cursor-default transition-opacity duration-500"
            onMouseEnter={() => setShowGhost(true)}
            onMouseLeave={() => setShowGhost(false)}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: `${item.size}px`,
              color: item.color,
              opacity: 1,
              animation: `floatWord ${item.duration}s ease-in-out infinite`,
              animationDelay: `${item.delay}s`,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {item.text}
          </span>
        ))}

        {/* Shakespeare portrait — faint background */}
        <div
          className="absolute inset-0 flex items-end justify-center pointer-events-none transition-opacity duration-1000"
          style={{ opacity: showGhost ? 1 : 0.05 }}
        >
          <img
            src="/shakespeare.png"
            alt=""
            className="max-h-[90%] max-w-[80%] object-contain"
            style={{
              filter: "grayscale(1)",
              animation: showGhost ? "ghostShake 0.4s ease-in-out infinite" : "none",
            }}
            draggable={false}
          />
        </div>

        {/* Hint text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-sm text-neutral-400">
            Ply Tails
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-xs text-neutral-400">Loading words...</p>
      </div>
    );
  }

  if (allWords.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-xs text-neutral-300">No lyrics found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-3 overflow-y-auto">
      {/* ── Floating area ── */}
      <div
        ref={containerRef}
        className="relative min-h-[300px] lg:min-h-[400px] rounded-xl bg-gradient-to-b from-white/30 to-white/10 border border-neutral-200/40 overflow-hidden flex-shrink-0"
      >
        <style jsx>{`
          @keyframes floatWord {
            0%,
            100% {
              transform: translate(0, 0) rotate(0deg);
            }
            25% {
              transform: translate(8px, -18px) rotate(1deg);
            }
            50% {
              transform: translate(-4px, -30px) rotate(-1deg);
            }
            75% {
              transform: translate(-12px, -12px) rotate(0.5deg);
            }
          }
          @keyframes catchAnim {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.4);
              opacity: 0.5;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
        `}</style>

        {wordItems.map((item) => {
          const isCaught = caught.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => catchWord(item)}
              disabled={isCaught}
              className={`absolute select-none transition-colors ${
                isCaught
                  ? "pointer-events-none"
                  : "text-neutral-500 hover:text-[#b5737a] hover:scale-110 cursor-pointer"
              }`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                fontSize: `${item.size}px`,
                animation: isCaught
                  ? "catchAnim 0.4s ease-out forwards"
                  : `floatWord ${item.duration}s ease-in-out infinite`,
                animationDelay: isCaught ? "0s" : `${item.delay}s`,
                fontWeight: item.size > 15 ? 500 : 400,
                opacity: isCaught ? 0 : 0.7,
              }}
            >
              {item.text}
            </button>
          );
        })}

        {/* Hint */}
        {composed.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 pointer-events-none">
            <span className="text-[11px] text-neutral-300">
              Click words to compose
            </span>
          </div>
        )}
      </div>

      {/* ── Composition area ── */}
      {composed.length > 0 && (
        <div className="rounded-xl bg-[#b5737a]/5 border border-[#b5737a]/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-[#b5737a] font-medium">
              Your composition
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={translateComposed}
                disabled={isTranslating}
                className="text-[10px] text-neutral-500 hover:text-[#b5737a] transition-colors disabled:opacity-50"
              >
                {isTranslating ? "..." : "Translate"}
              </button>
              <button
                onClick={clearComposed}
                className="text-[10px] text-neutral-500 hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {composed.map((word, i) => (
              <span
                key={i}
                onClick={() => removeFromComposed(i)}
                className="px-2 py-0.5 text-xs text-neutral-700 bg-white/70 rounded-full cursor-pointer hover:bg-red-50 hover:text-red-400 transition-colors"
              >
                {word}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-neutral-600 italic leading-relaxed">
            {composed.join(" ")}
          </p>
          {translatedText && (
            <p className="mt-1 text-xs text-[#b5737a]/70 italic leading-relaxed">
              {translatedText}
            </p>
          )}
        </div>
      )}

    </div>
  );
}
