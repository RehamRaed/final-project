'use server' 

import {
    fetchAllRoadmapsWithCourseCount,
    fetchRoadmapDetails,
    fetchUserCurrentRoadmap,
    fetchCourseLessons,
    upsertLessonProgress,
    updateXp,
    fetchCourseXpReward, 
} from '@/services/learning.service'
import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/types/database.types'

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
    const totalCourses = coursesInRoadmap.length

    const completedCourses = coursesInRoadmap.filter(
        rc => rc.course?.user_progress?.[0]?.status === 'completed'
    ).length

    return {
        success: true,
        data: {
            ...data,
            progress_percent: totalCourses > 0 ? Math.floor((completedCourses / totalCourses) * 100) : 0,
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
        l => l.user_progress?.[0]?.status === 'completed'
    ).length

    return {
        success: true,
        data: {
            ...data,
            lesson_progress_percent: totalLessons > 0 ? Math.floor((completedLessons / totalLessons) * 100) : 0,
        }
    }
}

export async function toggleLessonCompletion(
    lessonId: string,
    courseId: string,
    newStatus: 'in_progress' | 'completed'
) {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "User not authenticated." };

    const supabase = await createClient();
    const isCompleted = newStatus === 'completed';

    const now = new Date().toISOString();
    const { data: progressData, error: progressError } = await supabase
        .from('user_lesson_progress')
        .upsert({
            user_id: userId,
            lesson_id: lessonId,
            status: newStatus, 
            completed_at: isCompleted ? now : null
        }, { onConflict: 'user_id,lesson_id' })
        .select()
        .single();

    if (progressError) return { success: false, error: `Failed to update progress: ${progressError.message}` }

    let xpUpdateResult = { success: true, xp: 0 };
    let courseCompleted = false;

    if (isCompleted) {
        const { data: courseData, error: courseError } = await fetchCourseLessons(supabase, courseId, userId);

        if (courseError || !courseData) {
            console.warn(`Could not fetch course lessons for ${courseId}.`);
        } else {
            const allLessons = courseData.lessons || [];
            const allCompleted = allLessons.every(
                lesson => lesson.user_progress?.[0]?.status === 'completed'
            );

            if (allCompleted) {
                courseCompleted = true;

                const xpReward = courseData.xp_reward || 0;

                if (xpReward > 0) {
                    const { data: profileUpdate, error: xpError } = await updateXp(
                        supabase,
                        userId,
                        xpReward
                    );

                    if (xpError) {
                        console.error(`Failed to update XP: ${xpError.message}`);
                        xpUpdateResult = { success: false, xp: xpReward };
                    } else {
                        xpUpdateResult = { success: true, xp: xpReward };
                    }
                }

                const now = new Date().toISOString();
                await supabase
                    .from('user_course_progress')
                    .upsert({
                        user_id: userId,
                        course_id: courseId,
                        status: 'completed',
                        completed_at: now
                    }, { onConflict: 'user_id,course_id' });
            }
        }
    }

    return {
        success: true,
        message: courseCompleted
            ? "Congratulations! Course completed and XP awarded."
            : isCompleted
                ? "Lesson completed."
                : "Lesson marked as in progress.",
        progress: progressData,
        xpUpdate: xpUpdateResult,
        courseCompleted
    }
}