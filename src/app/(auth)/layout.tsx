import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* 좌측: 브랜드 패널 */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#5d6a7a] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#5d6a7a] via-[#6d7a8a] to-[#5d6a7a]" />
        <div className="relative z-10 px-16 max-w-lg">
          <Link
            href="/"
            className="text-lg font-light tracking-[0.2em] uppercase text-white/80 mb-12 block"
          >
            Publisher
          </Link>
          <h2 className="text-4xl font-extralight text-white leading-snug mb-6">
            Stories That
            <br />
            <span className="italic text-white/60">Inspire</span>
          </h2>
          <p className="text-sm text-white/30 leading-relaxed">
            Join our community of discerning readers. Access exclusive
            collections, curated recommendations, and member-only editions.
          </p>
        </div>
        {/* 데코레이션 */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 border border-white/5 rounded-full" />
        <div className="absolute -top-10 -left-10 w-40 h-40 border border-white/5 rounded-full" />
      </div>

      {/* 우측: 폼 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
