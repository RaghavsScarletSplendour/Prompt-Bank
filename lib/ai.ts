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
 * Generate use cases for a prompt using GPT-4o-mini.
 * These describe scenarios where someone would use this prompt.
 *
 * Example:
 * Input: "Make my text sound more human and natural..."
 * Output: "humanize AI text, natural writing, avoid AI detection, college essays, blog posts, professional emails"
 */
export async function generateUseCases(name: string, content: string): Promise<string> {
  const client = getOpenAIClient();

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You generate search-optimized use cases for a prompt library. Given a prompt's name and content, generate 8-10 diverse task descriptions that someone might search when they need this prompt.

Include variety across:
- Specific tasks (e.g., "writing a cover letter for a tech job")
- General tasks (e.g., "improving my writing")
- Different contexts (work, school, personal)
- Different phrasings of the same need

Output only the use cases, comma-separated, no explanation.`
        },
        {
          role: "user",
          content: `Name: ${name}\n\nContent: ${content}`
        }
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Use case generation failed:", error);
    return "";
  }
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
