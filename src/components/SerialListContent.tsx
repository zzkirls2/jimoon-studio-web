"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap/register";
import type { SerialPost } from "@/types/serial";

const POSTS_PER_PAGE = 10;

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const date = d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const hour = d.getHours();
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${date} ${hour}시 ${minute}분`;
}

export default function SerialListContent({ posts }: { posts: SerialPost[] }) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredPosts = query
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.author.toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".serial-item");
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
  }, [query, currentPage]);

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-6 md:px-12 relative">
      {/* Search — top right */}
      <div className="flex justify-end mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색"
          className="w-40 md:w-48 px-0 py-1.5 text-sm bg-transparent border-b border-black/20 focus:border-black/60 outline-none transition-colors placeholder:text-black/30"
        />
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-24">
          <p className="text-black/40 text-sm">
            {query ? "검색 결과가 없습니다." : "아직 연재 글이 없습니다."}
          </p>
        </div>
      )}

      <div ref={gridRef} className="flex flex-col gap-12">
        {paginatedPosts.map((post, index) => (
          <Link
            href={`/serial/${post.id}`}
            key={post.id}
            className="serial-item group flex items-start gap-6 font-[family-name:var(--font-gamja-flower)]"
          >
            <span className="text-[26px] font-extralight text-black/10 group-hover:text-[#b5737a]/30 transition-colors duration-300 pt-1 shrink-0 w-8 text-right">
              {String((currentPage - 1) * POSTS_PER_PAGE + index + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col justify-center min-w-0">
              <h2 className="text-[16px] md:text-[18px] font-light text-black mb-2 group-hover:text-[#b5737a] transition-colors duration-300">
                {post.title}
              </h2>
              <div className="flex items-center gap-3 text-[14px] text-black/30 group-hover:text-[#b5737a] transition-colors duration-300">
                <span>{post.category}</span>
                <span>·</span>
                <span>{post.author}</span>
                <span>·</span>
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`w-8 h-8 text-sm rounded-full transition-all duration-300 ${
                currentPage === page
                  ? "bg-black text-white"
                  : "text-black/40 hover:text-black/70"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
