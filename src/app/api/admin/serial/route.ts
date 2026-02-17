import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, content, category } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "title, content, category are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("serial_posts")
      .insert({
        title,
        author: author || "표현",
        content,
        category,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create serial post:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
