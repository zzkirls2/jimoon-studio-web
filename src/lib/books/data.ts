import type { Book } from "@/types/book";

// 데모용 정적 데이터 (추후 Supabase DB로 교체)
export const BOOKS: Book[] = [
  {
    id: "1",
    title: "The Weight of Silence",
    author: "Eleanor Park",
    description:
      "A luminous meditation on the spaces between words, exploring how silence shapes our deepest connections. Park weaves together three generations of women navigating love, loss, and the unspoken bonds that hold families together.",
    price: 28000,
    cover_image: "/books/book-1.jpg",
    isbn: "978-89-1234-001-1",
    published_at: "2025-03-15",
    category: "literary-fiction",
    pages: 324,
    in_stock: true,
  },
  {
    id: "2",
    title: "Meridian Lines",
    author: "Thomas Verne",
    description:
      "A collection of poems that traces the invisible lines connecting disparate places and moments. Verne's verse is both precise and expansive, drawing maps of emotional geography across continents and decades.",
    price: 18000,
    cover_image: "/books/book-2.jpg",
    isbn: "978-89-1234-002-8",
    published_at: "2025-01-20",
    category: "poetry",
    pages: 128,
    in_stock: true,
  },
  {
    id: "3",
    title: "A Distant Architecture",
    author: "Soo-Jin Lee",
    description:
      "Eleven essays on the intersection of built space and human memory. Lee examines how buildings remember, how ruins speak, and how the architecture of our cities reflects the invisible structures of our inner lives.",
    price: 24000,
    cover_image: "/books/book-3.jpg",
    isbn: "978-89-1234-003-5",
    published_at: "2024-11-10",
    category: "essays",
    pages: 256,
    in_stock: true,
  },
  {
    id: "4",
    title: "The Cartographer's Dream",
    author: "Maya Chen",
    description:
      "In a world where dreams can be mapped, one cartographer discovers that the landscape of sleep holds the key to a mystery that spans centuries. A genre-defying novel that blends literary fiction with elements of the fantastic.",
    price: 26000,
    cover_image: "/books/book-4.jpg",
    isbn: "978-89-1234-004-2",
    published_at: "2025-06-01",
    category: "literary-fiction",
    pages: 412,
    in_stock: true,
  },
  {
    id: "5",
    title: "Tidal Patterns",
    author: "James Holloway",
    description:
      "A masterful short story collection set along the coastlines of the world. Each story captures a moment of transformation, where the rhythm of the tides mirrors the ebb and flow of human relationships.",
    price: 22000,
    cover_image: "/books/book-5.jpg",
    isbn: "978-89-1234-005-9",
    published_at: "2024-09-25",
    category: "short-stories",
    pages: 208,
    in_stock: true,
  },
  {
    id: "6",
    title: "On Impermanence",
    author: "Yuki Tanaka",
    description:
      "A philosophical exploration of transience through the lens of Japanese aesthetics. Tanaka draws on mono no aware, wabi-sabi, and contemporary thought to offer a profound meditation on what it means to live in a world of constant change.",
    price: 20000,
    cover_image: "/books/book-6.jpg",
    isbn: "978-89-1234-006-6",
    published_at: "2025-02-14",
    category: "philosophy",
    pages: 192,
    in_stock: false,
  },
];

export const CATEGORIES = [
  { id: "all", name: "All", slug: "all" },
  { id: "literary-fiction", name: "Literary Fiction", slug: "literary-fiction" },
  { id: "poetry", name: "Poetry", slug: "poetry" },
  { id: "essays", name: "Essays", slug: "essays" },
  { id: "short-stories", name: "Short Stories", slug: "short-stories" },
  { id: "philosophy", name: "Philosophy", slug: "philosophy" },
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
