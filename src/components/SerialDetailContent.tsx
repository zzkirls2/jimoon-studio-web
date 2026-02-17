"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { SerialPost } from "@/types/serial";
import FadeIn from "@/components/animations/FadeIn";

function isHTML(str: string) {
  return /^<[a-z][\s\S]*>/i.test(str.trim());
}

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

export default function SerialDetailContent({
  post,
  prevPost,
  nextPost,
}: {
  post: SerialPost;
  prevPost: { id: string; title: string } | null;
  nextPost: { id: string; title: string } | null;
}) {
  return (
    <div className="min-h-screen pt-32 pb-24 max-w-3xl mx-auto px-6 md:px-12">
      {/* Header */}
      <FadeIn>
        <Link
          href="/serial"
          className="text-xs text-black/30 hover:text-[#b5737a] transition-colors mb-8 inline-block"
        >
          &larr; 목록으로
        </Link>

        <h1 className="text-[22px] font-extralight text-black mb-12 leading-relaxed">
          {post.title}
        </h1>
      </FadeIn>

      {/* Content */}
      <FadeIn delay={0.1}>
        <article className="serial-content mb-10">
          {isHTML(post.content) ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <ReactMarkdown>{post.content}</ReactMarkdown>
          )}
        </article>

        <div className="border-t border-black/10 pt-4 mb-0">
          <div className="flex items-center gap-3 text-xs text-black/40">
            <span>{post.category}</span>
            <span>·</span>
            <span>{post.author}</span>
            <span>·</span>
            <span>{formatDate(post.published_at)}</span>
          </div>
        </div>
      </FadeIn>

      {/* Prev / Next */}
      <div className="flex justify-between items-stretch gap-4 pt-8">
        {prevPost ? (
          <Link
            href={`/serial/${prevPost.id}`}
            className="group flex-1 text-left"
          >
            <span className="text-xs text-black/40 group-hover:text-[#b5737a] mb-1 block transition-colors">이전글</span>
            <span className="text-xs text-black/40 group-hover:text-[#b5737a] transition-colors">
              {prevPost.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextPost ? (
          <Link
            href={`/serial/${nextPost.id}`}
            className="group flex-1 text-right"
          >
            <span className="text-xs text-black/40 group-hover:text-[#b5737a] mb-1 block transition-colors">다음글</span>
            <span className="text-xs text-black/40 group-hover:text-[#b5737a] transition-colors">
              {nextPost.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
