import { NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ roadmapId: string }> }
) {
  try {
    const params = await props.params;
    const { roadmapId } = params;
    
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("roadmaps")
      .select(`
        *,
        courses:roadmap_courses(
          order_index,
          course:courses(*)
        )
      `)
      .eq("id", roadmapId)
      .single();

    if (error || !data)
      return errorResponse("Roadmap not found", "NOT_FOUND", 404);

    if (data.courses && Array.isArray(data.courses)) {
      data.courses.sort(
        (a: { order_index: number | null }, b: { order_index: number | null }) =>
          (a.order_index || 0) - (b.order_index || 0)
      );
    }

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}