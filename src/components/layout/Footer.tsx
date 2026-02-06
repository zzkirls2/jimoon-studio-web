import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <p className="text-lg font-light tracking-[0.2em] uppercase text-neutral-900 mb-4">
              Publisher
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Stories that inspire. Words that endure.
              We curate the finest literary works for discerning readers.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-neutral-400 mb-6">
              Navigate
            </p>
            <div className="flex flex-col gap-3">
              {["Books", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-neutral-400 mb-6">
              Account
            </p>
            <div className="flex flex-col gap-3">
              {["Login", "Sign Up", "Cart"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "")}`}
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-300 tracking-wider">
            &copy; {new Date().getFullYear()} Publisher. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
