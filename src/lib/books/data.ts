import type { Book } from "@/types/book";

// 데모용 정적 데이터 (추후 Supabase DB로 교체)
export const BOOKS: Book[] = [
  {
    id: "1",
    title: "The Weight of Silence",
    author: "Eleanor Park",
    publisher: "출판사 지문",
    description:
      "A luminous meditation on the spaces between words, exploring how silence shapes our deepest connections. Park weaves together three generations of women navigating love, loss, and the unspoken bonds that hold families together.",
    price: 28000,
    cover_image: "/books/book-1.jpg",
    images: ["/books/book-1-front.jpg", "/books/book-1-back.jpg"],
    isbn: "978-89-1234-001-1",
    published_at: "2025-03-15",
    category: "literary-fiction",
    pages: 324,
    size: "128 x 188mm",
    binding: "양장",
    in_stock: true,
    store_links: {
      kyobo: "#",
      aladin: "#",
      yes24: "#",
      ypbooks: "#",
    },
  },
];

export const CATEGORIES = [
  { id: "all", name: "모두", slug: "all" },
  { id: "literary-fiction", name: "소설", slug: "literary-fiction" },
];

export function getBookById(id: string): Book | undefined {
  return BOOKS.find((book) => book.id === id);
}

export function getBooksByCategory(category: string): Book[] {
  if (category === "all") return BOOKS;
  return BOOKS.filter((book) => book.category === category);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}
