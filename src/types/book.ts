export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  description: string;
  price: number;
  cover_image: string;
  images: string[];
  isbn: string;
  published_at: string;
  category: string;
  pages: number;
  size: string;
  binding: string;
  in_stock: boolean;
  store_links?: {
    kyobo?: string;
    aladin?: string;
    yes24?: string;
    ypbooks?: string;
  };
}

export interface BookCategory {
  id: string;
  name: string;
  slug: string;
}
