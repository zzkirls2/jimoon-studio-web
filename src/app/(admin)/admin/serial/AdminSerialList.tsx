"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SerialPost } from "@/types/serial";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AdminSerialList({ posts }: { posts: SerialPost[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 글을 삭제하시겠습니까?`)) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/serial/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(`삭제 실패: ${data.error}`);
        return;
      }
      router.refresh();
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <Link
          href="/admin/serial/write"
          className="px-4 py-2 text-sm bg-black text-white hover:bg-[#b5737a] transition-colors rounded-full"
        >
          새 글 작성
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-black/40 text-sm py-24">
          아직 연재 글이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-black/10">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between py-4 gap-4"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/serial/${post.id}`}
                  className="text-sm text-black hover:text-[#b5737a] transition-colors"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-2 mt-1 text-xs text-black/40">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href={`/admin/serial/edit/${post.id}`}
                  className="px-3 py-1.5 text-xs text-black/50 border border-black/20 hover:bg-black/5 transition-colors rounded-full"
                >
                  수정
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  disabled={deleting === post.id}
                  className="px-3 py-1.5 text-xs text-red-500 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 rounded-full"
                >
                  {deleting === post.id ? "삭제 중..." : "삭제"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
