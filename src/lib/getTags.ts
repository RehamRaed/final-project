import { SupabaseClient } from "@supabase/supabase-js";

export async function getTags(supabase:SupabaseClient) {
  const { data, error } = await supabase
    .from("tag")
    .select("id, name")
    .order("name");

  if (error) throw error;
  return data;
}