import { SupabaseClient } from "@supabase/supabase-js";

export async function fetchUserCourseProgress(userId: string, courseId: string, supabase:SupabaseClient) {
  const { data, error } = await supabase
    .from('user_course_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (error) throw error;

  return data; // returns the row with status, started_at, completed_at
}
