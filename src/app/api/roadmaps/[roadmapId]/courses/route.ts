import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ roadmapId: string }> }
) {
  try {
    const params = await props.params;
    const { roadmapId } = params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("roadmap_courses")
      .select(`
        course:courses(
          id,
          title,
          description,
          lessons(id, title, content, duration, order_index)
        )
      `)
      .eq("roadmap_id", roadmapId)
      .order("course.order_index", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const courses = (data || []).map((item: { course: any }) => {
      const course = item.course;
      course?.lessons?.sort(
        (a: { order_index: number | null }, b: { order_index: number | null }) => (a.order_index || 0) - (b.order_index || 0)
      );
      return course;
    });

    return NextResponse.json({ data: courses });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
