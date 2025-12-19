import { createServerSupabase } from "@/lib/supabase/server"
import { getUserFromRequest } from "@/lib/auth/helpers"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase()
    const user = await getUserFromRequest(request)
    
    if (!user) return errorResponse("Unauthorized", "UNAUTHORIZED", 401)

    const { data, error } = await supabase
      .from("profiles")
      .select(`
        *,
        current_roadmap:roadmaps(*)
      `)
      .eq("id", user.id)
      .single()

    if (error || !data) return errorResponse("Profile not found", "NOT_FOUND", 404)

    return successResponse(data)
  } catch (error) {
    return handleApiError(error)
  }
}