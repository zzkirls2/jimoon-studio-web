import type { Book } from "@/types/book";
import { createClient } from "@/lib/supabase/server";

export async function getBooks(): Promise<Book[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch books:", error);
    return [];
  }
  return data ?? [];
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch book:", error);
    return undefined;
  }
  return data ?? undefined;
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
  if (category === "all") return getBooks();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("category", category)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch books by category:", error);
    return [];
  }
  return data ?? [];
}
