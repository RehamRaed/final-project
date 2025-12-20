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
    // Fetch roadmap with its courses and lessons (no user-specific joins)
    const { data, error } = await client
        .from('roadmaps')
        .select(
            `
            *,
            roadmap_courses(
                order_index,
                course:courses(
                    *,
                    lessons(
                        id
                    )
                )
            )
            `
        )
        .eq('id', roadmapId)
        .order('order_index', { foreignTable: 'roadmap_courses', ascending: true })
        .single();

    if (error || !data) return { data: data as DetailedRoadmap | null, error };

    // Collect course IDs to fetch per-user course progress
    const courseEntries = (data as { roadmap_courses?: { course?: { id: string } }[] }).roadmap_courses || [];
    const courseIds: string[] = courseEntries
        .map((rc: { course?: { id: string } }) => rc.course?.id)
        .filter(Boolean);

    let progressRows: { course_id: string; status: string | null }[] = [];

    if (courseIds.length > 0) {
        const { data: progressData, error: progressError } = await client
            .from('user_course_progress')
            .select('course_id, status')
            .eq('user_id', userId)
            .in('course_id', courseIds);

        if (!progressError && progressData) {
            progressRows = progressData as { course_id: string; status: string | null }[];
        }
    }

    const allLessonIds: string[] = [];
    (courseEntries as unknown as { course?: { lessons?: { id: string }[] } }[]).forEach((rc) => {
        const lessonList = rc.course?.lessons || [];
        lessonList.forEach((l: { id: string }) => {
            if (l?.id) allLessonIds.push(l.id);
        });
    });

    let lessonProgressRows: { lesson_id: string; status: string | null; completed_at: string | null }[] = [];
    if (allLessonIds.length > 0) {
        const { data: lessonProgressData, error: lessonProgressError } = await client
            .from('user_lesson_progress')
            .select('lesson_id, status, completed_at')
            .eq('user_id', userId)
            .in('lesson_id', allLessonIds);

        if (!lessonProgressError && lessonProgressData) {
            lessonProgressRows = lessonProgressData || [];
        }
    }

    const roadmapCourses: RoadmapCourseDetails[] = (courseEntries as unknown as { course?: CourseWithProgress | null; order_index?: number }[]).map((rc) => {
        const course = rc.course as CourseWithProgress | null;
        if (!course) return { order_index: rc.order_index ?? null, course: null };

        const userProgress = progressRows.filter((p: { course_id: string; status: string | null }) => p.course_id === course.id).map(p => ({ status: p.status })) || null;

        const lessons = (course.lessons || []).map((l: { id: string; [key: string]: unknown }) => {
            const progressForLesson = lessonProgressRows.filter((r: { lesson_id: string; status: string | null; completed_at: string | null }) => r.lesson_id === l.id).map(r => ({ status: r.status, completed_at: r.completed_at })) || null;
            return { ...l, user_progress: progressForLesson };
        });

        const courseWithProgress: CourseWithProgress = {
            ...course,
            user_progress: userProgress,
            lessons,
        };
        return { order_index: rc.order_index ?? null, course: courseWithProgress };
    });

    const detailed: DetailedRoadmap = {
        ...(data as unknown as Omit<DetailedRoadmap, 'roadmap_courses'>),
        roadmap_courses: roadmapCourses,
    };

    return { data: detailed, error: null };
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
    // First fetch the course and lessons (without joining user progress)
    const { data: courseData, error: courseError } = await client
        .from('courses')
        .select(
            `
            *,
            lessons(
                *
            )
            `
        )
        .eq('id', courseId)
        .order('order_index', { foreignTable: 'lessons', ascending: true })
        .single();

    if (courseError) return { data: null, error: courseError };

    const lessons = (courseData?.lessons || []) as Lesson[];

    // Fetch the current user's progress for lessons in this course
    const lessonIds = lessons.map((l) => l.id).filter(Boolean);

    let progressRows: { lesson_id: string; status: string | null; completed_at: string | null }[] = [];

    if (lessonIds.length > 0) {
        const { data: progressData, error: progressError } = await client
            .from('user_lesson_progress')
            .select('lesson_id, status, completed_at')
            .eq('user_id', userId)
            .in('lesson_id', lessonIds);

        if (progressError) {
            // don't fail the whole request due to missing progress; return course without progress
            progressRows = [];
        } else {
            progressRows = progressData || [];
        }
    }

    // Merge progress into lessons
    const lessonsWithProgress: LessonWithProgress[] = lessons.map((lesson) => ({
        ...lesson,
        user_progress: progressRows.filter((p) => p.lesson_id === lesson.id).map((p) => ({ status: p.status, completed_at: p.completed_at })) || null,
    }));

    const detailed: DetailedCourse = {
        ...courseData,
        lessons: lessonsWithProgress,
        xp_reward: (courseData as { xp_reward?: number | null }).xp_reward ?? null,
    };

    return { data: detailed as DetailedCourse | null, error: null };
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