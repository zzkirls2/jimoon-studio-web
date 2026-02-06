"use client";

import TextSplit from "@/components/animations/TextSplit";
import FadeIn from "@/components/animations/FadeIn";
import HeroSection from "@/components/home/HeroSection";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import PhilosophySection from "@/components/home/PhilosophySection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Featured Books */}
      <section className="py-32 md:py-48 max-w-7xl mx-auto px-6 md:px-12">
        <FadeIn>
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-6">
            Curated Selection
          </p>
        </FadeIn>
        <TextSplit className="text-4xl md:text-6xl font-light leading-tight tracking-tight text-neutral-900 mb-20">
          Stories Worth Telling
        </TextSplit>
        <FeaturedBooks />
      </section>

      {/* Philosophy */}
      <PhilosophySection />

      {/* CTA */}
      <CTASection />
    </>
  );
}
