'use server'

import {
    fetchAllRoadmapsWithCourseCount,
    fetchRoadmapDetails,
    fetchUserCurrentRoadmap,
    fetchCourseLessons,
    upsertLessonProgress,
    updateXp,
} from '@/services/learning.service'
import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/types/database.types'
import { revalidatePath } from 'next/cache';

async function getCurrentUserId(): Promise<string | null> {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id || null;
}

type RoadmapWithStatus = Tables<'roadmaps'> & {
    course_count: number;
    is_current: boolean;
}

export async function getRoadmapsListAction() {
    const userId = await getCurrentUserId()
    if (!userId) return { success: false, error: "User not authenticated." }

    const supabase = await createClient()
    const { data: roadmapsData, error: roadmapsError } = await fetchAllRoadmapsWithCourseCount(supabase)
    if (roadmapsError) return { success: false, error: roadmapsError.message }

    const { data: profileData } = await fetchUserCurrentRoadmap(supabase, userId)
    const currentRoadmapId = profileData?.current_roadmap_id

    const roadmaps: RoadmapWithStatus[] = (roadmapsData || []).map(roadmap => ({
        ...roadmap,
        course_count: roadmap.roadmap_courses?.[0]?.count || 0,
        is_current: roadmap.id === currentRoadmapId,
    }))

    return { success: true, data: roadmaps }
}

export async function getRoadmapDetailsAction(roadmapId: string) {
    const userId = await getCurrentUserId()
    if (!userId) return { success: false, error: "User not authenticated." }

    const supabase = await createClient()
    const { data, error } = await fetchRoadmapDetails(supabase, roadmapId, userId)

    if (error) return { success: false, error: error.message }
    if (!data) return { success: false, error: "Roadmap not found." }

    const coursesInRoadmap = data.roadmap_courses || [];

    // Fetch user profile for XP
    const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', userId)
        .single();

    // Calculate overall progress based on lessons
    let totalRoadmapLessons = 0;
    let completedRoadmapLessons = 0;

    coursesInRoadmap.forEach(rc => {
        const lessons = rc.course?.lessons || [];
        totalRoadmapLessons += lessons.length;
        completedRoadmapLessons += lessons.filter(l =>
            l.user_progress?.[0]?.status === 'Completed' || l.user_progress?.[0]?.status === 'completed'
        ).length;
    });

    const progressPercent = totalRoadmapLessons > 0
        ? Math.floor((completedRoadmapLessons / totalRoadmapLessons) * 100)
        : 0;

    return {
        success: true,
        data: {
            ...data,
            ...data,
            xp: profile?.xp || 0,
            progress_percent: progressPercent,
        }
    }
}


export async function updateCurrentRoadmapAction(newRoadmapId: string) {
    const userId = await getCurrentUserId()
    if (!userId) return { success: false, error: "User not authenticated." }

    const supabase = await createClient()

    const { error } = await supabase
        .from('profiles')
        .update({ current_roadmap_id: newRoadmapId })
        .eq('id', userId)

    if (error) return { success: false, error: error.message }
    return { success: true, message: "Roadmap updated successfully." }
}

export async function getCourseLessonsAction(courseId: string) {
    const userId = await getCurrentUserId()
    if (!userId) return { success: false, error: "User not authenticated." }

    const supabase = await createClient()

    const { data, error } = await fetchCourseLessons(supabase, courseId, userId)

    if (error) return { success: false, error: error.message }
    if (!data) return { success: false, error: "Course not found." }

    const lessonsInCourse = data.lessons || [];
    const totalLessons = lessonsInCourse.length

    const completedLessons = lessonsInCourse.filter(
        l => l.user_progress?.[0]?.status === 'Completed' || l.user_progress?.[0]?.status === 'completed'
    ).length

    // Fetch user's current roadmap
    const { data: profile } = await supabase
        .from('profiles')
        .select('current_roadmap_id')
        .eq('id', userId)
        .single();

    return {
        success: true,
        data: {
            ...data,
            current_roadmap_id: profile?.current_roadmap_id || null,
            lesson_progress_percent: totalLessons > 0 ? Math.floor((completedLessons / totalLessons) * 100) : 0,
        }
    }
}

export async function toggleLessonCompletion(
    lessonId: string,
    courseId: string,
    newStatus: 'InProgress' | 'Completed'
) {
    const validStatus = newStatus === 'Completed' ? 'Completed' : 'InProgress';

    console.log("toggleLessonCompletion called with:", { lessonId, courseId, validStatus });

    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "User not authenticated." };

    const supabase = await createClient();

    const { data: progressData, error: progressError } = await upsertLessonProgress(
        supabase,
        userId,
        lessonId,
        validStatus === 'Completed'
    );

    if (progressError) {
        console.error("Error updating lesson progress:", progressError);
        return { success: false, error: `Failed to update progress: ${progressError.message}` }
    }

    let xpUpdateResult = { success: true, xp: 0 };
    let courseCompleted = false;

    if (validStatus === 'Completed') {
        const { data: courseData, error: courseError } = await fetchCourseLessons(supabase, courseId, userId);

        if (courseError || !courseData) {
            console.warn(`Could not fetch course lessons for ${courseId}.`);
        } else {
            const allLessons = courseData.lessons || [];

            // تحسين: التحقق من الإكمال مع مراعاة الحالة الحالية التي لم تُجلب بعد من الـ fetch أعلاه
            const completedCount = allLessons.filter(
                lesson =>
                    lesson.id === lessonId || // الدرس الحالي اكتمل الآن
                    lesson.user_progress?.[0]?.status === 'Completed' ||
                    lesson.user_progress?.[0]?.status === 'completed'
            ).length;

            if (completedCount === allLessons.length) {
                courseCompleted = true;
                const xpReward = courseData.xp_reward || 0;

                if (xpReward > 0) {
                    const { error: xpError } = await updateXp(supabase, userId, xpReward);
                    if (xpError) {
                        console.error(`Failed to update XP: ${xpError.message}`);
                        xpUpdateResult = { success: false, xp: xpReward };
                    }
                }

                const { error: courseProgressError } = await supabase
                    .from('user_course_progress')
                    .upsert({
                        user_id: userId,
                        course_id: courseId,
                        status: 'Completed',
                        completed_at: new Date().toISOString()
                    }, { onConflict: 'user_id,course_id' });

                if (courseProgressError) {
                    console.error("Failed to update course progress:", courseProgressError);
                } else {
                    console.log("Course progress updated to Completed for:", courseId);
                }
            }
        }
    }

    // نقل الـ revalidate للنهاية لضمان تحديث كل شيء
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/courses/${courseId}/lessons`);

    return {
        success: true,
        message: courseCompleted
            ? "Congratulations! Course completed and XP awarded."
            : validStatus === 'Completed'
                ? "Lesson completed."
                : "Lesson marked as in progress.",
        progress: progressData,
        xpUpdate: xpUpdateResult,
        courseCompleted
    }
}