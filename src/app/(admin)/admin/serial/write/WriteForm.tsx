"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import EditorToolbar from "./EditorToolbar";

interface WriteFormProps {
  initialData?: {
    id: string;
    title: string;
    author: string;
    content: string;
    category: string;
  };
}

export default function WriteForm({ initialData }: WriteFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [author, setAuthor] = useState(initialData?.author ?? "표현");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [submitting, setSubmitting] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "본문을 입력하세요..." }),
    ],
    content: initialData?.content ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[400px] focus:outline-none [&_p]:leading-[2] [&_p]:text-justify [&_h2]:font-light [&_h2]:text-xl [&_h3]:font-light [&_blockquote]:border-l-2 [&_blockquote]:border-[#b5737a] [&_blockquote]:pl-4 [&_blockquote]:italic",
      },
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!editor || !title.trim() || !category.trim()) {
      alert("제목, 카테고리, 본문을 모두 입력해주세요.");
      return;
    }

    const content = editor.getHTML();
    if (!content || content === "<p></p>") {
      alert("본문을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const url = isEdit
        ? `/api/admin/serial/${initialData.id}`
        : "/api/admin/serial";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), author: author.trim(), content, category: category.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(`${isEdit ? "수정" : "작성"} 실패: ${data.error}`);
        return;
      }

      const post = await res.json();
      router.push(`/serial/${post.id}`);
    } catch {
      alert(`${isEdit ? "수정" : "작성"} 중 오류가 발생했습니다.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2">
          카테고리
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="에세이, 단편, 칼럼..."
          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-[#b5737a] transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2">
          제목
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="글 제목"
          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-[#b5737a] transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2">
          작성자
        </label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm outline-none focus:border-[#b5737a] transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2">
          본문
        </label>
        <div className="bg-neutral-50 border border-neutral-200 p-4">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-sm text-black/50 hover:text-black transition-colors rounded-full"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 text-sm bg-black text-white hover:bg-[#b5737a] transition-colors disabled:opacity-50 rounded-full"
        >
          {submitting ? "저장 중..." : isEdit ? "수정" : "발행"}
        </button>
      </div>
    </form>
  );
}
