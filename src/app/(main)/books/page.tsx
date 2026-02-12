import { getBooks } from "@/lib/books/data";
import BooksContent from "@/components/BooksContent";

export default async function BooksPage() {
  const books = await getBooks();

  return <BooksContent books={books} />;
}
