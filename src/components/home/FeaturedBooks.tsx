"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap/register";
import FadeIn from "@/components/animations/FadeIn";

const BOOKS = [
  {
    id: "1",
    title: "The Weight of Silence",
    author: "Eleanor Park",
    category: "Literary Fiction",
    color: "#e8e0d4",
  },
  {
    id: "2",
    title: "Meridian Lines",
    author: "Thomas Verne",
    category: "Poetry",
    color: "#d4dce8",
  },
  {
    id: "3",
    title: "A Distant Architecture",
    author: "Soo-Jin Lee",
    category: "Essays",
    color: "#dce8d4",
  },
];

export default function FeaturedBooks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll(".book-card");
      if (!cards) return;

      cards.forEach((card, i) => {
        const bookCover = card.querySelector(".book-cover");
        const bookInfo = card.querySelector(".book-info");

        gsap.set(bookCover, { y: 60, opacity: 0, rotateY: -8 });
        gsap.set(bookInfo, { y: 30, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        tl.to(bookCover, {
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 0.9,
          delay: i * 0.15,
          ease: "power3.out",
        }).to(
          bookInfo,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        );

        // 호버 3D 효과
        if (bookCover) {
          const coverEl = bookCover as HTMLElement;
          coverEl.addEventListener("mouseenter", () => {
            gsap.to(coverEl, {
              rotateY: 6,
              rotateX: -3,
              scale: 1.03,
              boxShadow: "20px 20px 60px rgba(0,0,0,0.15)",
              duration: 0.4,
              ease: "power2.out",
            });
          });
          coverEl.addEventListener("mouseleave", () => {
            gsap.to(coverEl, {
              rotateY: 0,
              rotateX: 0,
              scale: 1,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
              duration: 0.4,
              ease: "power2.out",
            });
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
    >
      {BOOKS.map((book) => (
        <article key={book.id} className="book-card group cursor-pointer">
          {/* 도서 커버 (3D perspective) */}
          <div className="perspective-[1200px] mb-8">
            <div
              className="book-cover relative aspect-[3/4] rounded-sm overflow-hidden"
              style={{
                backgroundColor: book.color,
                transformStyle: "preserve-3d",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              {/* 커버 디자인 */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="w-8 h-px bg-neutral-400/40 mb-4" />
                <p className="text-xs tracking-[0.2em] uppercase text-neutral-500/60 mb-2">
                  {book.category}
                </p>
                <h3 className="text-lg font-light text-neutral-700 leading-snug">
                  {book.title}
                </h3>
              </div>

              {/* 책 등 효과 */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-black/5" />
            </div>
          </div>

          {/* 도서 정보 */}
          <div className="book-info">
            <p className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-2">
              {book.category}
            </p>
            <h3 className="text-lg font-light text-neutral-900 mb-1 group-hover:text-neutral-600 transition-colors duration-300">
              {book.title}
            </h3>
            <p className="text-sm text-neutral-400">{book.author}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
