// /services/learning.service.ts
import { Database, Tables } from '@/types/database.types'
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js"

type Roadmap = Tables<"roadmaps">;
type Course = Tables<"courses">;
type Lesson = Tables<"lessons">;
type Profile = Tables<"profiles">;
type UserLessonProgress = Tables<"user_lesson_progress">;

type RoadmapWithCourseCount = Roadmap & {
    roadmap_courses: { count: number }[];
}

type CourseWithProgress = Course & {
    user_progress: { status: string | null }[] | null;
    lessons: { id: string; user_progress: { status: string | null }[] | null }[] | null;
}

type RoadmapCourseDetails = {
    order_index: number | null;
    course: CourseWithProgress | null;
}

type DetailedRoadmap = Roadmap & {
    roadmap_courses: RoadmapCourseDetails[] | null;
}

type LessonWithProgress = Lesson & {
    user_progress: { status: string | null; completed_at: string | null }[] | null
}

type DetailedCourse = Course & {
    lessons: LessonWithProgress[] | null;
    xp_reward: number | null;
}

type ServiceResponse<T> = { data: T | null; error: PostgrestError | null }

export async function fetchAllRoadmapsWithCourseCount(
    client: SupabaseClient<Database>
): Promise<ServiceResponse<RoadmapWithCourseCount[]>> {
    const { data, error } = await client
        .from('roadmaps')
        .select(
            `
            *,
            roadmap_courses(count)
            `
        )
        .eq('is_active', true)
        .order('created_at', { ascending: true });

    // يجب تحويل النوع ليتناسب مع RoadmapWithCourseCount[]
    return { data: data as RoadmapWithCourseCount[] | null, error };
}

export async function fetchRoadmapDetails(
    client: SupabaseClient<Database>,
    roadmapId: string,
    userId: string
): Promise<ServiceResponse<DetailedRoadmap>> {
    const { data, error } = await client
        .from('roadmaps')
        .select(
            `
            *,
            roadmap_courses(
                order_index,
                course:courses(
                    *,
                    user_progress:user_course_progress(status),
                    lessons(
                        id,
                        user_progress:user_lesson_progress(status)
                    )
                )
            )
            `
        )
        .eq('id', roadmapId)
        .eq('roadmap_courses.course.user_course_progress.user_id', userId)
        .order('order_index', { foreignTable: 'roadmap_courses', ascending: true })
        .single();

    return { data: data as DetailedRoadmap | null, error };
}

export async function fetchUserCurrentRoadmap(
    client: SupabaseClient<Database>,
    userId: string
): Promise<ServiceResponse<Pick<Profile, 'current_roadmap_id'>>> {
    const { data, error } = await client
        .from('profiles')
        .select('current_roadmap_id')
        .eq('id', userId)
        .single();

    return { data: data as Pick<Profile, 'current_roadmap_id'> | null, error };
}

export async function fetchCourseLessons(
    client: SupabaseClient<Database>,
    courseId: string,
    userId: string
): Promise<ServiceResponse<DetailedCourse>> {
    const { data, error } = await client
        .from('courses')
        .select(
            `
            *,
            lessons(
                *,
                user_progress:user_lesson_progress(status, completed_at)
            )
            `
        )
        .eq('id', courseId)
        .eq('lessons.user_lesson_progress.user_id', userId)
        .order('order_index', { foreignTable: 'lessons', ascending: true })
        .single();

    return { data: data as DetailedCourse | null, error };
}

export async function upsertLessonProgress(
    client: SupabaseClient<Database>,
    userId: string,
    lessonId: string,
    isCompleted: boolean,
): Promise<ServiceResponse<UserLessonProgress>> {

    // const completed_at = isCompleted ? new Date().toISOString() : null;

    // const payload: TablesInsert<'user_lesson_progress'> = {
    //     user_id: userId,
    //     lesson_id: lessonId,
    //     status,
    //     completed_at,
    //     // لا نحتاج لـ id أو created_at في Insert إذا كانا يُولدان تلقائياً
    // };

    // const { data, error } = await client
    //     .from('user_lesson_progress')
    //     .upsert(payload, { onConflict: 'user_id,lesson_id' })
    //     .select()
    //     .single()



    const { data, error } = await client
        .from('user_lesson_progress')
        .upsert({
            user_id: userId,
            lesson_id: lessonId,
            status: isCompleted ? 'Completed' : 'InProgress', // نرسل القيمة مباشرة            completed_at: isCompleted ? new Date().toISOString() : null,
        }, {
            onConflict: 'user_id,lesson_id' // تأكد أن هذا القيد موجود في SQL
        })
        .select()
        .single();
    return { data: data as UserLessonProgress | null, error };
}

export async function updateXp(
    client: SupabaseClient<Database>,
    userId: string,
    xpChange: number // قيمة الزيادة أو النقصان
): Promise<ServiceResponse<Profile>> {

    const { error } = await client.rpc('increment_xp', {
        user_id_input: userId,
        xp_amount: xpChange,
    });

    if (error) {
        return { data: null, error };
    }

    const { data: profile, error: fetchError } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    return { data: profile as Profile | null, error: fetchError };
}

export async function fetchCourseXpReward(
    client: SupabaseClient<Database>,
    courseId: string
): Promise<ServiceResponse<Pick<Course, 'xp_reward'>>> {
    const { data, error } = await client
        .from('courses')
        .select('xp_reward')
        .eq('id', courseId)
        .single();

    return { data: data as Pick<Course, 'xp_reward'> | null, error };
}