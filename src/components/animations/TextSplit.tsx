"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";

interface TextSplitProps {
  children: string;
  className?: string;
  as?: "div";
  delay?: number;
}

export default function TextSplit({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
}: TextSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // 글자 단위로 span 래핑
    const text = el.textContent || "";
    el.innerHTML = "";

    const words = text.split(" ");
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.overflow = "hidden";

      word.split("").forEach((char) => {
        const charSpan = document.createElement("span");
        charSpan.textContent = char;
        charSpan.style.display = "inline-block";
        charSpan.classList.add("split-char");
        wordSpan.appendChild(charSpan);
      });

      el.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        const space = document.createElement("span");
        space.innerHTML = "&nbsp;";
        space.style.display = "inline-block";
        el.appendChild(space);
      }
    });

    const chars = el.querySelectorAll(".split-char");

    gsap.set(chars, {
      y: "110%",
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(chars, {
      y: "0%",
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.02,
      delay,
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [children, delay]);

  return (
    <Tag
      ref={containerRef}
      className={className}
    >
      {children}
    </Tag>
  );
}
