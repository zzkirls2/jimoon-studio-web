export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  cover_image: string;
  isbn: string;
  published_at: string;
  category: string;
  pages: number;
  in_stock: boolean;
}

export interface BookCategory {
  id: string;
  name: string;
  slug: string;
}
