import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { Tables } from "@/types/database.types";

export type Lesson = Tables<'lessons'>;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ roadmapId: string; courseId: string }> }
) {
  try {
    const { roadmapId, courseId } = await context.params; 
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from('lessons') 
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}