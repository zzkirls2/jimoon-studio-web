"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBookById, formatPrice } from "@/lib/books/data";
import { useCartStore } from "@/stores/cart";
import FadeIn from "@/components/animations/FadeIn";
import { useState } from "react";

const COVER_COLORS: Record<string, string> = {
  "1": "#e8e0d4",
  "2": "#d4dce8",
  "3": "#dce8d4",
  "4": "#e8d4d4",
  "5": "#d4e8e4",
  "6": "#e4dce8",
};

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const book = getBookById(params.id as string);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  if (!book) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <p className="text-neutral-400 mb-6">Book not found.</p>
        <Link
          href="/books"
          className="text-sm text-neutral-900 underline underline-offset-4"
        >
          Back to Books
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
      {/* Breadcrumb */}
      <FadeIn>
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-16">
          <Link href="/books" className="hover:text-neutral-700 transition-colors">
            Books
          </Link>
          <span>/</span>
          <span className="text-neutral-600">{book.title}</span>
        </nav>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Cover */}
        <FadeIn direction="left">
          <div className="perspective-[1200px]">
            <div
              className="relative aspect-[3/4] rounded-sm overflow-hidden max-w-md mx-auto lg:mx-0"
              style={{
                backgroundColor: COVER_COLORS[book.id] || "#e5e5e5",
                transformStyle: "preserve-3d",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-end p-10">
                <div className="w-10 h-px bg-neutral-400/40 mb-5" />
                <p className="text-xs tracking-[0.2em] uppercase text-neutral-500/60 mb-2">
                  {book.category.replace("-", " ")}
                </p>
                <h2 className="text-xl font-light text-neutral-700 leading-snug mb-2">
                  {book.title}
                </h2>
                <p className="text-sm text-neutral-500/60">{book.author}</p>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-black/5" />
            </div>
          </div>
        </FadeIn>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <FadeIn delay={0.1}>
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-4">
              {book.category.replace("-", " ")}
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1 className="text-3xl md:text-4xl font-extralight text-neutral-900 mb-3 leading-tight">
              {book.title}
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-base text-neutral-500 mb-8">by {book.author}</p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p className="text-neutral-400 text-sm leading-[1.8] mb-10">
              {book.description}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-neutral-100">
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-1">
                  Pages
                </p>
                <p className="text-sm text-neutral-700">{book.pages}</p>
              </div>
              <div className="w-px h-8 bg-neutral-100" />
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-1">
                  ISBN
                </p>
                <p className="text-sm text-neutral-700">{book.isbn}</p>
              </div>
              <div className="w-px h-8 bg-neutral-100" />
              <div>
                <p className="text-[10px] tracking-[0.15em] uppercase text-neutral-400 mb-1">
                  Published
                </p>
                <p className="text-sm text-neutral-700">
                  {new Date(book.published_at).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="flex items-center gap-6">
              <p className="text-2xl font-extralight text-neutral-900">
                {formatPrice(book.price)}
              </p>

              {book.in_stock ? (
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 text-sm tracking-[0.1em] uppercase transition-all duration-300 ${
                    added
                      ? "bg-green-800 text-white"
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  }`}
                >
                  {added ? "Added to Cart" : "Add to Cart"}
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 py-3.5 text-sm tracking-[0.1em] uppercase bg-neutral-200 text-neutral-400 cursor-not-allowed"
                >
                  Sold Out
                </button>
              )}
            </div>
          </FadeIn>

          {added && (
            <FadeIn>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-green-700">
                  Item added to cart.
                </span>
                <Link
                  href="/cart"
                  className="text-sm text-neutral-900 underline underline-offset-4"
                >
                  View Cart
                </Link>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
