
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { id: courseId } = params;

        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
        }

        const { data: existing } = await supabase
            .from('user_course_progress')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .single();

        if (existing) {
            return errorResponse('Already enrolled', 'ALREADY_ENROLLED', 400);
        }

        const { data: enrollment, error } = await supabase
            .from('user_course_progress')
            .insert({
                user_id: user.id,
                course_id: courseId,
                status: 'InProgress',
                started_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        return successResponse(enrollment, undefined, 201);

    } catch (error) {
        return handleApiError(error);
    }
}
