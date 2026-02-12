"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { SerialPost } from "@/types/serial";
import FadeIn from "@/components/animations/FadeIn";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SerialDetailContent({
  post,
  seriesPosts,
  prevPost,
  nextPost,
}: {
  post: SerialPost;
  seriesPosts: SerialPost[];
  prevPost: { id: string; title: string } | null;
  nextPost: { id: string; title: string } | null;
}) {
  return (
    <div className="min-h-screen pt-32 pb-24 max-w-3xl mx-auto px-6 md:px-12">
      {/* Header */}
      <FadeIn>
        <Link
          href="/about"
          className="text-sm text-black/40 hover:text-black transition-colors mb-8 inline-block"
        >
          &larr; 목록으로
        </Link>

        {post.series_name && (
          <p className="text-sm text-[#b5737a] mb-3">{post.series_name}</p>
        )}

        <h1 className="text-3xl md:text-4xl font-extralight text-black mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-black/40 mb-12">
          <span>{post.author}</span>
          <span>·</span>
          <span>{formatDate(post.published_at)}</span>
        </div>
      </FadeIn>

      {/* Content */}
      <FadeIn delay={0.1}>
        <article className="prose prose-neutral max-w-none mb-16 [&_p]:text-black/80 [&_p]:leading-[2] [&_h2]:text-black [&_h2]:font-light [&_h2]:text-xl [&_h3]:text-black [&_h3]:font-light [&_blockquote]:border-[#b5737a] [&_blockquote]:text-black/60 [&_a]:text-[#b5737a] [&_img]:rounded">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
      </FadeIn>

      {/* Series List */}
      {seriesPosts.length > 1 && (
        <div className="mb-16 p-6 bg-black/[0.02] border border-black/5">
          <p className="text-sm font-medium text-black mb-4">
            {post.series_name}
          </p>
          <div className="flex flex-col gap-2">
            {seriesPosts.map((sp, i) => (
              <Link
                key={sp.id}
                href={`/about/${sp.id}`}
                className={`text-sm py-1 transition-colors duration-300 ${
                  sp.id === post.id
                    ? "text-[#b5737a] font-medium"
                    : "text-black/50 hover:text-black"
                }`}
              >
                {i + 1}. {sp.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next */}
      <div className="flex justify-between items-stretch gap-4 border-t border-black/10 pt-8">
        {prevPost ? (
          <Link
            href={`/about/${prevPost.id}`}
            className="group flex-1 text-left"
          >
            <span className="text-xs text-black/30 mb-1 block">이전글</span>
            <span className="text-sm text-black/70 group-hover:text-black transition-colors">
              {prevPost.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextPost ? (
          <Link
            href={`/about/${nextPost.id}`}
            className="group flex-1 text-right"
          >
            <span className="text-xs text-black/30 mb-1 block">다음글</span>
            <span className="text-sm text-black/70 group-hover:text-black transition-colors">
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
