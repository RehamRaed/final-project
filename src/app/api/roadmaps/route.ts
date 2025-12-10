import { createClient } from "@/lib/supabase/server"
import { successResponse, handleApiError } from "@/lib/api-response"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("is_active", true)
      .order("title")

    if (error) throw error

    return successResponse(data)
  } catch (error) {
    return handleApiError(error)
  }
}
