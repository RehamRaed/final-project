import { createClient } from "@/lib/supabase/server"
import { getUserFromRequest } from "@/lib/auth/helpers"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const user = await getUserFromRequest(request)
    if (!user) return errorResponse("Unauthorized", "UNAUTHORIZED", 401)

    const { roadmapId } = await request.json()
    if (!roadmapId) return errorResponse("roadmapId is required", "BAD_REQUEST", 400)

    const { error } = await supabase
      .from("profiles")
      .update({ current_roadmap_id: roadmapId })
      .eq("id", user.id)

    if (error) return errorResponse(error.message, "UPDATE_FAILED", 400)

    return successResponse({ message: "Roadmap updated successfully" })
  } catch (error) {
    return handleApiError(error)
  }
}
