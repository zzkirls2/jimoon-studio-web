export interface SerialPost {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  content: string;
  thumbnail: string | null;
  category: string;
  series_name: string | null;
  series_order: number | null;
  published_at: string;
}
