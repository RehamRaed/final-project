import { Tables } from "@/types/database.types";
export type Profile = Tables<"profiles">;
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;

  const { user } = data;

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profileData) return null;

  return profileData as Profile;
}

export async function getUserFromRequest(req: Request): Promise<Profile | null> {
  const supabase = await createClient();

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) return null;

  const { user } = data;

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profileData) return null;

  return profileData as Profile;
}
