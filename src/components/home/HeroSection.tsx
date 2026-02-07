"use client";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 via-white to-neutral-50" />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <div className="w-16 h-px bg-neutral-300 mx-auto mb-12" />

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight leading-[1.1] tracking-tight text-neutral-900 mb-8">
          Words That
          <br />
          <span className="italic font-light text-neutral-500">Transcend</span>
        </h1>

        <p className="text-base md:text-lg font-light text-neutral-400 tracking-wide max-w-lg mx-auto leading-relaxed">
          Curating the finest literary works for readers who seek depth, beauty,
          and meaning.
        </p>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
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
