import Link from "next/link";
import { getBookById } from "@/lib/books/data";
import BookDetailContent from "@/components/BookDetailContent";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <p className="text-black mb-6">책을 찾을 수 없습니다.</p>
        <Link
          href="/books"
          className="text-sm text-black underline underline-offset-4"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return <BookDetailContent book={book} />;
}
