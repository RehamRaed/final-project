import { Tables } from "@/types/database.types";
import { createServerSupabase } from "@/lib/supabase/server"; 

export type Profile = Tables<"profiles">;


export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = await createServerSupabase();

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
  const supabase = await createServerSupabase();


  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  const { data, error } = await (token 
    ? supabase.auth.getUser(token) 
    : supabase.auth.getUser());

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