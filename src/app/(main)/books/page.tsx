"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";
import { BOOKS, CATEGORIES, formatPrice } from "@/lib/books/data";
import FadeIn from "@/components/animations/FadeIn";
import TextSplit from "@/components/animations/TextSplit";

const COVER_COLORS: Record<string, string> = {
  "1": "#e8e0d4",
  "2": "#d4dce8",
  "3": "#dce8d4",
  "4": "#e8d4d4",
  "5": "#d4e8e4",
  "6": "#e4dce8",
};

export default function BooksPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredBooks =
    activeCategory === "all"
      ? BOOKS
      : BOOKS.filter((b) => b.category === activeCategory);

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".book-item");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [activeCategory]);

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
      {/* Header */}
      <div className="mb-16">
        <FadeIn>
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-6">
            Collection
          </p>
        </FadeIn>
        <TextSplit className="text-4xl md:text-6xl font-extralight leading-tight tracking-tight text-neutral-900 mb-8">
          Our Books
        </TextSplit>
        <FadeIn delay={0.2}>
          <p className="text-neutral-400 text-base font-light max-w-lg leading-relaxed">
            Each title is selected for its singular ability to illuminate,
            provoke, and endure. Browse our complete catalog.
          </p>
        </FadeIn>
      </div>

      {/* Category Filter */}
      <FadeIn delay={0.3}>
        <div className="flex flex-wrap gap-3 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2 text-sm tracking-wider transition-all duration-300 ${
                activeCategory === cat.slug
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Book Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
      >
        {filteredBooks.map((book) => (
          <Link
            href={`/books/${book.id}`}
            key={book.id}
            className="book-item group"
          >
            {/* Cover */}
            <div className="perspective-[1200px] mb-6">
              <div
                className="relative aspect-[3/4] rounded-sm overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                style={{
                  backgroundColor: COVER_COLORS[book.id] || "#e5e5e5",
                  transformStyle: "preserve-3d",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="w-6 h-px bg-neutral-400/40 mb-3" />
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500/60 mb-1.5">
                    {book.category.replace("-", " ")}
                  </p>
                  <h3 className="text-base font-light text-neutral-700 leading-snug">
                    {book.title}
                  </h3>
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-black/5" />

                {!book.in_stock && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/80 backdrop-blur-sm text-[10px] tracking-[0.15em] uppercase text-neutral-400">
                    Sold Out
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1.5">
              {book.author}
            </p>
            <h3 className="text-base font-light text-neutral-900 mb-1 group-hover:text-neutral-600 transition-colors duration-300">
              {book.title}
            </h3>
            <p className="text-sm text-neutral-400">{formatPrice(book.price)}</p>
          </Link>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-24">
          <p className="text-neutral-400 text-sm">
            No books found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
