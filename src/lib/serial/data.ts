import type { SerialPost } from "@/types/serial";
import { createClient } from "@/lib/supabase/server";

export async function getSerialPosts(): Promise<SerialPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("serial_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch serial posts:", error);
    return [];
  }
  return data ?? [];
}

export async function getSerialPostById(
  id: string
): Promise<SerialPost | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("serial_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch serial post:", error);
    return undefined;
  }
  return data ?? undefined;
}

export async function getSeriesPosts(
  seriesName: string
): Promise<SerialPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("serial_posts")
    .select("*")
    .eq("series_name", seriesName)
    .order("series_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch series posts:", error);
    return [];
  }
  return data ?? [];
}

export async function getAdjacentPosts(publishedAt: string) {
  const supabase = await createClient();

  const [prevResult, nextResult] = await Promise.all([
    supabase
      .from("serial_posts")
      .select("id, title")
      .lt("published_at", publishedAt)
      .order("published_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("serial_posts")
      .select("id, title")
      .gt("published_at", publishedAt)
      .order("published_at", { ascending: true })
      .limit(1)
      .single(),
  ]);

  return {
    prev: prevResult.data ?? null,
    next: nextResult.data ?? null,
  };
}
