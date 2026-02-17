import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-black/10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/serial"
              className="text-sm font-light tracking-wide text-black hover:text-[#b5737a] transition-colors"
            >
              Admin
            </Link>
            <Link
              href="/admin/serial/write"
              className="text-xs text-black/50 hover:text-[#b5737a] transition-colors"
            >
              글쓰기
            </Link>
          </div>
          <Link
            href="/serial"
            className="text-xs text-black/40 hover:text-black/70 transition-colors"
          >
            사이트로 &rarr;
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}
