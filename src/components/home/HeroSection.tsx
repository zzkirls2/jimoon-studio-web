"use client";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#fef9f3] via-[#fef9f3] to-[#fef9f3]" />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="w-16 h-px bg-[#e8c4b8] mx-auto mb-12" />

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight leading-[1.1] tracking-tight text-black mb-8">
          Words That
          <br />
          <span className="italic font-light text-black/70">Transcend</span>
        </h1>

        <p className="text-base md:text-lg font-light text-black/60 tracking-wide max-w-lg mx-auto leading-relaxed">
          Curating the finest literary works for readers who seek depth, beauty,
          and meaning.
        </p>
      </div>

    </section>
  );
}
