import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/embeddings";
import { expandSearchQuery } from "@/lib/ai";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { query, limit = 10 } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Expand query with related terms for better intent matching
    const expandedQuery = await expandSearchQuery(query.trim());

    // Generate embedding for expanded search query
    const queryEmbedding = await generateEmbedding(expandedQuery);

    // Call Supabase RPC function for vector similarity search
    const { data, error } = await supabase.rpc("match_prompts", {
      query_embedding: queryEmbedding,
      match_user_id: userId,
      match_count: limit,
      match_threshold: 0.4,
    });

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    return NextResponse.json({ prompts: data });
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
