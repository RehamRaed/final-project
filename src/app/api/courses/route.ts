import { NextRequest } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { courseFilterSchema } from '@/lib/validators/index';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();

    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());

    const validatedParams = courseFilterSchema.safeParse(searchParams);
    if (!validatedParams.success) {
      return errorResponse(
        'Invalid Filters',
        'BP_VALIDATION',
        400,
        validatedParams.error.issues
      );
    }

    const { page, limit, level, category_id, search } = validatedParams.data;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('courses')
      .select('*', { count: 'exact' });

    if (level) query = query.eq('level', level);
    if (category_id) query = query.eq('category_id', category_id);
    if (search) query = query.ilike('title', `%${search}%`);

    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data: courses, count, error } = await query;

    if (error) throw error;

    return successResponse(courses, {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
