"use client";

import Link from "next/link";
import TextSplit from "@/components/animations/TextSplit";
import FadeIn from "@/components/animations/FadeIn";

export default function CTASection() {
  return (
    <section className="py-32 md:py-48 max-w-7xl mx-auto px-6 md:px-12 text-center">
      <FadeIn>
        <div className="w-16 h-px bg-neutral-300 mx-auto mb-12" />
      </FadeIn>

      <TextSplit className="text-4xl md:text-6xl font-extralight leading-tight tracking-tight text-neutral-900 mb-8">
        Begin Your Journey
      </TextSplit>

      <FadeIn delay={0.3}>
        <p className="text-neutral-400 text-base md:text-lg font-light max-w-md mx-auto mb-12 leading-relaxed">
          Explore our complete catalog and find
          the stories that speak to you.
        </p>
      </FadeIn>

      <FadeIn delay={0.45}>
        <Link
          href="/books"
          className="inline-block border border-neutral-900 text-neutral-900 px-10 py-4 text-sm tracking-[0.15em] uppercase hover:bg-neutral-900 hover:text-white transition-all duration-500"
        >
          Browse Collection
        </Link>
      </FadeIn>
    </section>
  );
}
