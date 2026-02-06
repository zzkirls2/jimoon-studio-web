"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";
import TextSplit from "@/components/animations/TextSplit";
import FadeIn from "@/components/animations/FadeIn";

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 큰 숫자 패럴랙스
      if (numberRef.current) {
        gsap.to(numberRef.current, {
          yPercent: -40,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 bg-neutral-900 text-white overflow-hidden"
    >
      {/* 배경 데코레이션 숫자 */}
      <span
        ref={numberRef}
        className="absolute -right-10 top-1/4 text-[20rem] md:text-[28rem] font-extralight text-white/[0.02] leading-none select-none pointer-events-none"
      >
        &amp;
      </span>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* 좌측: 큰 타이포그래피 */}
          <div>
            <FadeIn>
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8">
                Our Philosophy
              </p>
            </FadeIn>
            <TextSplit className="text-4xl md:text-5xl lg:text-6xl font-extralight leading-[1.15] tracking-tight text-white">
              Beauty in Every Detail
            </TextSplit>
          </div>

          {/* 우측: 설명 텍스트 */}
          <div className="md:pt-16">
            <FadeIn delay={0.2}>
              <p className="text-neutral-400 leading-[1.8] text-base md:text-lg font-light mb-8">
                We believe that a book is more than its content.
                The texture of the paper, the weight of the binding,
                the rhythm of the typesetting — every element
                is a deliberate act of craft.
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <p className="text-neutral-500 leading-[1.8] text-sm font-light mb-10">
                Each title in our catalog is selected not merely for its
                literary merit, but for the singular experience it offers
                the reader — a convergence of thought and form.
              </p>
            </FadeIn>
            <FadeIn delay={0.5}>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-3xl font-extralight text-white mb-1">200+</p>
                  <p className="text-xs tracking-[0.15em] uppercase text-neutral-500">
                    Titles Published
                  </p>
                </div>
                <div className="w-px h-12 bg-neutral-700" />
                <div>
                  <p className="text-3xl font-extralight text-white mb-1">15</p>
                  <p className="text-xs tracking-[0.15em] uppercase text-neutral-500">
                    Years of Craft
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
