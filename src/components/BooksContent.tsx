"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap/register";
import { CATEGORIES, formatPrice } from "@/lib/books/constants";
import type { Book } from "@/types/book";
import FadeIn from "@/components/animations/FadeIn";
import BookImageCarousel from "@/components/BookImageCarousel";

const COVER_COLORS: Record<string, string> = {
  "1": "#e8e0d4",
};

export default function BooksContent({ books }: { books: Book[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredBooks =
    activeCategory === "all"
      ? books
      : books.filter((b) => b.category === activeCategory);

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
      {/* Category Filter */}
      <FadeIn delay={0.3}>
        <div className="flex flex-wrap gap-3 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2 text-sm tracking-wider rounded-full transition-all duration-300 ${
                activeCategory === cat.slug
                  ? "bg-black text-white"
                  : "bg-[#e8c4b8]/30 text-[#5d6a7a] hover:bg-[#e8c4b8]/50"
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
            <div className="mb-6">
              <BookImageCarousel
                images={book.images}
                fallbackColor={COVER_COLORS[book.id] || "#e5e5e5"}
                title={book.title}
                author={book.author}
              />
            </div>

            {/* Info */}
            <p className="text-[10px] tracking-[0.2em] uppercase text-black mb-1.5 group-hover:text-[#b5737a] transition-colors duration-300">
              {book.author}
            </p>
            <h3 className="text-base font-light text-black mb-1 group-hover:text-[#b5737a] transition-colors duration-300">
              {book.title}
            </h3>
            <p className="text-sm text-black group-hover:text-[#b5737a] transition-colors duration-300">
              {formatPrice(book.price)}
            </p>
          </Link>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-24">
          <p className="text-black/60 text-sm">
            해당 카테고리에 책이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
