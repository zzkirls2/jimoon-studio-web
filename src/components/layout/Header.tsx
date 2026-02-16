"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap/register";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/stores/cart";

type NavLink = { label: string; href: string };
type NavDropdown = { label: string; children: NavLink[] };
type NavItem = NavLink | NavDropdown;

function isDropdown(item: NavItem): item is NavDropdown {
  return "children" in item;
}

const navItems: NavItem[] = [
  { label: "책", href: "/books" },
  { label: "연재", href: "/serial" },
  {
    label: "실험실",
    children: [
      { label: "Library", href: "/lab/library" },
      { label: "Fingerprint Game", href: "/lab/fingerprint-game" },
      { label: "Playlist", href: "/lab/playlist" },
    ],
  },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { user, loading: authLoading, signOut } = useAuth();
  const totalItems = useCartStore((s) => s.totalItems);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    gsap.to(el, {
      backgroundColor: scrolled
        ? "rgba(254, 249, 243, 0.95)"
        : "rgba(254, 249, 243, 0)",
      backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
      borderBottom: scrolled
        ? "1px solid rgba(0,0,0,0.06)"
        : "1px solid rgba(0,0,0,0)",
      duration: 0.4,
      ease: "power2.out",
    });
  }, [scrolled]);

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  const cartCount = totalItems();

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 transition-none"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="지문"
              width={32}
              height={32}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-12">
            {navItems.map((item) =>
              isDropdown(item) ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 text-base tracking-wider text-neutral-900 hover:text-[#b5737a] transition-colors duration-300">
                    {item.label}
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${
                      openDropdown === item.label
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="bg-white/90 backdrop-blur-md border border-neutral-100 rounded-xl py-1.5 min-w-[180px] shadow-lg shadow-black/[0.06]">
                      {item.children.map((child, idx) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 text-[13px] tracking-wide text-neutral-600 hover:text-[#b5737a] hover:bg-[#b5737a]/[0.04] transition-all duration-200 ${
                            idx !== item.children.length - 1 ? "border-b border-neutral-100/60" : ""
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base tracking-wider text-neutral-900 hover:text-[#b5737a] transition-colors duration-300"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-8">
            {/* Cart */}
            {user && (
              <Link
                href="/cart"
                className="relative text-base tracking-wider text-neutral-900 hover:text-[#b5737a] transition-colors duration-300"
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-4 w-5 h-5 bg-[#b5737a] text-white text-[10px] rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth - hidden for now */}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 w-6"
              aria-label="Toggle menu"
            >
              <span
                className={`h-px bg-neutral-900 transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-[3.5px] w-6" : "w-6"
                }`}
              />
              <span
                className={`h-px bg-neutral-900 transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-[3.5px] w-6" : "w-4"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#fef9f3] pt-20 md:hidden">
          <nav className="flex flex-col px-6 py-8 gap-6">
            {navItems.map((item) =>
              isDropdown(item) ? (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setMobileExpanded(
                        mobileExpanded === item.label ? null : item.label
                      )
                    }
                    className="text-2xl font-extralight text-neutral-900 flex items-center gap-2"
                  >
                    {item.label}
                    <span
                      className={`text-sm transition-transform duration-300 ${
                        mobileExpanded === item.label ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="flex flex-col gap-4 pl-4 mt-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-xl font-extralight text-neutral-700"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-extralight text-neutral-900"
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Auth - hidden for now */}
          </nav>
        </div>
      )}
    </>
  );
}
