"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap/register";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/stores/cart";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(255, 255, 255, 0)",
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
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-light tracking-[0.2em] uppercase text-neutral-900"
          >
            Publisher
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-sm tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 w-5 h-5 bg-neutral-900 text-white text-[10px] rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {!authLoading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-4">
                    <span className="text-xs text-neutral-400 truncate max-w-[120px]">
                      {user.user_metadata?.name || user.email?.split("@")[0]}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-sm tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden md:block text-sm tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors duration-300"
                  >
                    Login
                  </Link>
                )}
              </>
            )}

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
        <div className="fixed inset-0 z-40 bg-white pt-20 md:hidden">
          <nav className="flex flex-col px-6 py-8 gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-extralight text-neutral-900"
              >
                {item.label}
              </Link>
            ))}

            <div className="h-px bg-neutral-100 my-4" />

            {user ? (
              <>
                <span className="text-sm text-neutral-400">
                  {user.user_metadata?.name || user.email}
                </span>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileOpen(false);
                  }}
                  className="text-lg font-extralight text-neutral-500 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-extralight text-neutral-900"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-extralight text-neutral-500"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
