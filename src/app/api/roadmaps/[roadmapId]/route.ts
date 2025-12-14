import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: { roadmapId: string } }
) {
  try {
    const { roadmapId } = params;
    const supabase = await createClient();

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

    data.courses?.sort(
      (a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)
    );

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
