"use client";

import Link from "next/link";
import type { Book } from "@/types/book";
import { formatPrice } from "@/lib/books/constants";
import FadeIn from "@/components/animations/FadeIn";
import BookImageCarousel from "@/components/BookImageCarousel";

const COVER_COLORS: Record<string, string> = {
  "1": "#e8e0d4",
};

const STORE_BUTTONS = [
  { key: "kyobo", label: "교보문고" },
  { key: "aladin", label: "알라딘" },
  { key: "yes24", label: "YES24" },
  { key: "ypbooks", label: "영풍문고" },
] as const;

export default function BookDetailContent({ book }: { book: Book }) {
  return (
    <div className="min-h-screen pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-12">
      {/* Breadcrumb */}
      <FadeIn>
        <nav className="flex items-center gap-2 text-base text-black mb-16">
          <Link href="/books" className="hover:text-[#b5737a] transition-colors">
            책
          </Link>
          <span>/</span>
          <span>{book.title}</span>
        </nav>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Cover */}
        <div className="max-w-md mx-auto lg:mx-0">
          <BookImageCarousel
            images={book.images}
            fallbackColor={COVER_COLORS[book.id] || "#e5e5e5"}
            title={book.title}
            author={book.author}
            clickToFlip
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <FadeIn delay={0.1}>
            <h1 className="text-3xl md:text-4xl font-extralight text-black mb-3 leading-tight">
              {book.title}
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="text-base text-black mb-8">{book.author}</p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-black text-sm leading-[1.8] mb-10">
              {book.description}
            </p>
          </FadeIn>

          {/* 도서 정보 */}
          <FadeIn delay={0.25}>
            <div className="mb-10 pb-10 border-b border-[#e8c4b8]/30">
              <table className="w-full text-sm">
                <tbody className="[&_tr]:border-b [&_tr]:border-[#e8c4b8]/20 [&_td]:py-3">
                  <tr>
                    <td className="text-black w-24">저자</td>
                    <td className="text-black">{book.author}</td>
                  </tr>
                  <tr>
                    <td className="text-black">출판사</td>
                    <td className="text-black">{book.publisher}</td>
                  </tr>
                  <tr>
                    <td className="text-black">발행일</td>
                    <td className="text-black">
                      {new Date(book.published_at).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-black">ISBN</td>
                    <td className="text-black">{book.isbn}</td>
                  </tr>
                  <tr>
                    <td className="text-black">쪽수</td>
                    <td className="text-black">{book.pages}쪽</td>
                  </tr>
                  <tr>
                    <td className="text-black">크기</td>
                    <td className="text-black">{book.size}</td>
                  </tr>
                  <tr>
                    <td className="text-black">제본</td>
                    <td className="text-black">{book.binding}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeIn>

          {/* 가격 */}
          <p className="text-2xl font-extralight text-black mb-8">
            {formatPrice(book.price)}
          </p>

          {/* 판매처 바로가기 */}
          {book.store_links && (
            <div>
              <p className="text-xs text-black mb-4">도서 판매처</p>
              <div className="flex flex-wrap gap-3">
                {STORE_BUTTONS.map(({ key, label }) => {
                  const url = book.store_links?.[key];
                  if (!url) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 text-sm rounded-full border border-black text-black hover:bg-black hover:text-[#fef9f3] transition-all duration-300"
                    >
                      {label}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
