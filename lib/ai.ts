import OpenAI from "openai";

// Lazy-initialize OpenAI client to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

/**
 * Expand a search query with related terms using GPT-4o-mini.
 * This helps match user intent to prompts even when exact words don't match.
 *
 * Example:
 * Input: "I am writing an essay for college"
 * Output: "I am writing an essay for college. Related: humanize text, natural writing, academic writing, avoid AI detection, essay structure"
 */
export async function expandSearchQuery(query: string): Promise<string> {
  const client = getOpenAIClient();

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You help expand search queries for a prompt library. Given a user's task or need, output 5-8 related keywords that describe AI prompts or tools they might need. Output only the keywords, comma-separated, no explanation."
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 100,
      temperature: 0.3,
    });

    const keywords = response.choices[0]?.message?.content?.trim() || "";

    if (keywords) {
      return `${query}. Related: ${keywords}`;
    }
    return query;
  } catch (error) {
    console.error("Query expansion failed:", error);
    // Fall back to original query if expansion fails
    return query;
  }
}
