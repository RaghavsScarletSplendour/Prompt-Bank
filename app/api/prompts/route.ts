import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }

  return NextResponse.json({ prompts: data });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, tags, content } = body;

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Length limits
    if (name.length > 100) {
      return NextResponse.json({ error: "Name too long (max 100 characters)" }, { status: 400 });
    }

    if (content.length > 10000) {
      return NextResponse.json({ error: "Content too long (max 10,000 characters)" }, { status: 400 });
    }

    if (tags && typeof tags === 'string' && tags.length > 500) {
      return NextResponse.json({ error: "Tags too long (max 500 characters)" }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedTags = tags && typeof tags === 'string' ? tags.trim() : null;
    const sanitizedContent = content.trim();

    const { data, error } = await supabase
      .from("prompts")
      .insert({ user_id: userId, name: sanitizedName, tags: sanitizedTags, content: sanitizedContent })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 });
    }

    return NextResponse.json({ prompt: data });
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
