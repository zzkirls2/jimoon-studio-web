"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap/register";
import type { SerialPost } from "@/types/serial";
import FadeIn from "@/components/animations/FadeIn";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SerialListContent({ posts }: { posts: SerialPost[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-6 md:px-12">
      {posts.length === 0 && (
        <div className="text-center py-24">
          <p className="text-black/40 text-sm">아직 연재 글이 없습니다.</p>
        </div>
      )}

      <div ref={gridRef} className="flex flex-col gap-12">
        {posts.map((post) => (
          <Link
            href={`/about/${post.id}`}
            key={post.id}
            className="serial-item group flex gap-6 md:gap-8"
          >
            {/* Thumbnail */}
            {post.thumbnail && (
              <div className="flex-shrink-0 w-28 h-28 md:w-40 md:h-40 overflow-hidden bg-neutral-100">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Info */}
            <div className="flex flex-col justify-center min-w-0">
              {post.series_name && (
                <span className="text-xs text-[#b5737a] mb-2">
                  {post.series_name}
                </span>
              )}
              <h2 className="text-lg md:text-xl font-light text-black mb-2 group-hover:text-[#b5737a] transition-colors duration-300">
                {post.title}
              </h2>
              <p className="text-sm text-black/50 line-clamp-2 mb-3">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 text-xs text-black/40">
                <span>{post.author}</span>
                <span>·</span>
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
