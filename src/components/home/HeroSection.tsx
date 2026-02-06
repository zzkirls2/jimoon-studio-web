"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 초기 상태 설정
      gsap.set(titleRef.current, { opacity: 0, y: 80 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 40 });
      gsap.set(lineRef.current, { scaleX: 0 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      // 인트로 타임라인
      const introTl = gsap.timeline({ delay: 0.3 });

      introTl
        .to(lineRef.current, {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
        })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .to(
          scrollIndicatorRef.current,
          {
            opacity: 1,
            duration: 0.6,
          },
          "-=0.2"
        );

      // 스크롤 패럴랙스: 히어로 텍스트가 위로 올라감
      gsap.to(titleRef.current, {
        yPercent: -50,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(subtitleRef.current, {
        yPercent: -30,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "70% top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* 배경 그래디언트 */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-white to-neutral-50" />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div
          ref={lineRef}
          className="w-16 h-px bg-neutral-300 mx-auto mb-12 origin-center"
        />

        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-extralight leading-[1.1] tracking-tight text-neutral-900 mb-8"
        >
          Words That
          <br />
          <span className="italic font-light text-neutral-500">Transcend</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-base md:text-lg font-light text-neutral-400 tracking-wide max-w-lg mx-auto leading-relaxed"
        >
          Curating the finest literary works for readers
          who seek depth, beauty, and meaning.
        </p>
      </div>

      {/* 스크롤 인디케이터 */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-300">
          Scroll
        </span>
        <div className="w-px h-12 bg-neutral-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-neutral-400 animate-scroll-line" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-line {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(400%);
          }
        }
        .animate-scroll-line {
          animation: scroll-line 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
