import { NextRequest } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { Tables } from '@/types/database.types';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { id } = params;

        const supabase = await createServerSupabase();

        const { data: course, error } = await supabase
            .from('courses')
            .select(`
                *,
                lessons (
                    id,
                    title,
                    content,
                    duration,
                    order_index
                )
            `)
            .eq('id', id)
            .single();

        if (error || !course) {
            return errorResponse('Course not found', 'NOT_FOUND', 404);
        }

        if (course.lessons) {
            course.lessons.sort((a: Tables<'lessons'>, b: Tables<'lessons'>) =>
                (a.order_index || 0) - (b.order_index || 0)
            );
        }

        return successResponse(course);
    } catch (error) {
        return handleApiError(error);
    }
}