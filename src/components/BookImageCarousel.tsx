"use client";

import { useState } from "react";
import Image from "next/image";

interface BookImageCarouselProps {
  images: string[];
  fallbackColor: string;
  title: string;
  author: string;
  aspectClass?: string;
  clickToFlip?: boolean;
}

export default function BookImageCarousel({
  images,
  fallbackColor,
  title,
  author,
  aspectClass = "aspect-[3/4]",
  clickToFlip = false,
}: BookImageCarouselProps) {
  const [frontError, setFrontError] = useState(false);
  const [backError, setBackError] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const hasTwoSides = images.length > 1;

  const fallback = (
    <div className="absolute inset-0 flex flex-col justify-end p-6">
      <div className="w-6 h-px bg-black/20 mb-3" />
      <h3 className="text-base font-light text-black leading-snug">{title}</h3>
      <p className="text-sm text-black mt-1">{author}</p>
    </div>
  );

  if (!hasTwoSides) {
    return (
      <div
        className={`relative ${aspectClass} rounded-sm overflow-hidden`}
        style={{ backgroundColor: fallbackColor, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
      >
        {!frontError ? (
          <Image
            src={images[0]}
            alt={`${title} - 앞표지`}
            fill
            className="object-cover"
            onError={() => setFrontError(true)}
          />
        ) : fallback}
      </div>
    );
  }

  return (
    <div
      className={`${aspectClass} [perspective:1200px] ${clickToFlip ? "cursor-pointer" : ""}`}
      onClick={clickToFlip ? (e) => { e.preventDefault(); setFlipped((f) => !f); } : undefined}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(15deg)]"
        style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
      >
        {/* 앞면 */}
        <div
          className="absolute inset-0 rounded-sm overflow-hidden [backface-visibility:hidden]"
          style={{ backgroundColor: fallbackColor, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
        >
          {!frontError ? (
            <Image
              src={images[0]}
              alt={`${title} - 앞표지`}
              fill
              className="object-cover"
              onError={() => setFrontError(true)}
            />
          ) : fallback}
        </div>

        {/* 뒷면 */}
        <div
          className="absolute inset-0 rounded-sm overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ backgroundColor: fallbackColor, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
        >
          {!backError ? (
            <Image
              src={images[1]}
              alt={`${title} - 뒷표지`}
              fill
              className="object-cover"
              onError={() => setBackError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <p className="text-sm text-black/40">뒷표지</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
