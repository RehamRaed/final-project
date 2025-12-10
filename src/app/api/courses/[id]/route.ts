
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { id } = params;

        const supabase = await createClient();

        const { data: course, error } = await supabase
            .from('courses')
            .select(`
                *,
                category:categories(id, name),
                lessons(id, title, duration, is_free, type, order_index)
            `)
            .eq('id', id)
            .single();

        if (error) {
            return errorResponse('Course not found', 'NOT_FOUND', 404);
        }

        if (course.lessons) {
            course.lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        }

        return successResponse(course);

    } catch (error) {
        return handleApiError(error);
    }
}
