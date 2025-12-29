import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { generateEmbedding, getEmbeddingText } from "@/lib/embeddings";
import { generateUseCases } from "@/lib/ai";

/**
 * One-time endpoint to backfill use_cases for existing prompts.
 * POST /api/prompts/backfill
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all prompts without use_cases
    const { data: prompts, error: fetchError } = await supabase
      .from("prompts")
      .select("id, name, content, tags")
      .eq("user_id", userId)
      .is("use_cases", null);

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
    }

    if (!prompts || prompts.length === 0) {
      return NextResponse.json({ message: "No prompts to backfill", updated: 0 });
    }

    let updated = 0;
    const errors: string[] = [];

    for (const prompt of prompts) {
      try {
        // Generate use cases
        const useCases = await generateUseCases(prompt.name, prompt.content);

        // Regenerate embedding with use cases included
        const embeddingText = getEmbeddingText(prompt.name, prompt.content, prompt.tags, useCases);
        const embedding = await generateEmbedding(embeddingText);

        // Update the prompt
        const { error: updateError } = await supabase
          .from("prompts")
          .update({ use_cases: useCases, embedding })
          .eq("id", prompt.id)
          .eq("user_id", userId);

        if (updateError) {
          errors.push(`Failed to update ${prompt.id}: ${updateError.message}`);
        } else {
          updated++;
        }
      } catch (err) {
        errors.push(`Error processing ${prompt.id}: ${err}`);
      }
    }

    return NextResponse.json({
      message: `Backfill complete`,
      total: prompts.length,
      updated,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Backfill error:", error);
    return NextResponse.json({ error: "Backfill failed" }, { status: 500 });
  }
}
