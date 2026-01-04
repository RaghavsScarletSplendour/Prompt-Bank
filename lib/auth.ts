import { auth } from "@clerk/nextjs/server";

export async function getSupabaseToken(): Promise<string | null> {
  const a = await auth();

  try {
    const token = await (a as any).getToken({ template: "supabase" });
    return token;
  } catch (err: any) {
    throw err;
  }
}

export async function requireSupabaseToken(): Promise<string> {
  const token = await getSupabaseToken();
  if (!token) throw new Error("Failed to get Supabase token");
  return token;
}
