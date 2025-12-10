// app/api/roadmaps/[id]/courses/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const roadmapId = params.id;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("roadmap_courses")
      .select("course:courses(*)")
      .eq("roadmap_id", roadmapId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // normalize
    const courses = (data || []).map((item: any) => item.course);
    return NextResponse.json({ data: courses });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
