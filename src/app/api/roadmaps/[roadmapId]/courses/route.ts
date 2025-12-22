import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { Tables } from "@/types/database.types";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ roadmapId: string }> }
) {
  try {
    const params = await props.params;
    const { roadmapId } = params;
    
    const supabase = await createServerSupabase();

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
      .order("course.order_index" as any, { ascending: true }); // أحياناً تتطلب الأنواع استخدام as any هنا حسب إعدادات الـ DB

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

<<<<<<< HEAD
    const rows = (data || []) as Record<string, unknown>[];
    const courses = rows.map((row) => {
      const course = (row['course'] as unknown) as Tables<'courses'> & {
        lessons?: Tables<'lessons'>[]
      };

=======
    const courses = (data || []).map((item: any) => {
      const course = item.course as Tables<'courses'> & {
        lessons: Tables<'lessons'>[]
      };
      
>>>>>>> 632faa3 (feat: migrate to server-side supabase client with cookie support)
      if (course?.lessons) {
        course.lessons.sort(
          (a: Tables<'lessons'>, b: Tables<'lessons'>) => (a.order_index || 0) - (b.order_index || 0)
        );
      }
      return course;
    });

    return NextResponse.json({ data: courses });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}