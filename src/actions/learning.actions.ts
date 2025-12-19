'use server';

import {
  fetchAllRoadmapsWithCourseCount,
  fetchRoadmapDetails,
  fetchUserCurrentRoadmap,
  fetchCourseLessons,
  updateXp,
} from '@/services/learning.service';

import { createServerSupabase } from '@/lib/supabase/server';
import { Tables } from '@/types/database.types';
import { revalidatePath } from 'next/cache';

async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
}

type RoadmapWithStatus = Tables<'roadmaps'> & {
  course_count: number;
  is_current: boolean;
};

export async function getRoadmapsListAction() {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: 'User not authenticated.' };

  const supabase = await createServerSupabase();

  const { data: roadmapsData, error: roadmapsError } =
    await fetchAllRoadmapsWithCourseCount(supabase);

  if (roadmapsError) {
    return { success: false, error: roadmapsError.message };
  }

  const { data: profileData } = await fetchUserCurrentRoadmap(
    supabase,
    userId
  );

  const currentRoadmapId = profileData?.current_roadmap_id;

  const roadmaps: RoadmapWithStatus[] = (roadmapsData || []).map(
    (roadmap) => ({
      ...roadmap,
      course_count: roadmap.roadmap_courses?.[0]?.count || 0,
      is_current: roadmap.id === currentRoadmapId,
    })
  );

  return { success: true, data: roadmaps };
}

export async function getRoadmapDetailsAction(roadmapId: string) {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: 'User not authenticated.' };

  const supabase = await createServerSupabase();

  const { data, error } = await fetchRoadmapDetails(
    supabase,
    roadmapId,
    userId
  );

  if (error) return { success: false, error: error.message };
  if (!data) return { success: false, error: 'Roadmap not found.' };

  const coursesInRoadmap = data.roadmap_courses || [];

  const completedCourses = coursesInRoadmap.filter(
    (rc) => rc.course?.user_progress?.[0]?.status === 'completed'
  ).length;

  const totalCourses = coursesInRoadmap.length;

  const progressPercent =
    totalCourses > 0
      ? Math.floor((completedCourses / totalCourses) * 100)
      : 0;

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', userId)
    .single();

  return {
    success: true,
    data: {
      ...data,
      xp: profile?.xp || 0,
      progress_percent: progressPercent,
    },
  };
}

export async function updateCurrentRoadmapAction(newRoadmapId: string) {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: 'User not authenticated.' };

  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from('profiles')
    .update({ current_roadmap_id: newRoadmapId })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/roadmaps');
  return { success: true, message: 'Roadmap updated successfully.' };
}

export async function getCourseLessonsAction(courseId: string) {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: 'User not authenticated.' };

  const supabase = await createServerSupabase();

  const { data, error } = await fetchCourseLessons(
    supabase,
    courseId,
    userId
  );

  if (error) return { success: false, error: error.message };
  if (!data) return { success: false, error: 'Course not found.' };

  const lessonsInCourse = data.lessons || [];
  const totalLessons = lessonsInCourse.length;

  const completedLessons = lessonsInCourse.filter(
    (l) =>
      l.user_progress?.[0]?.status === 'Completed' ||
      l.user_progress?.[0]?.status === 'completed'
  ).length;

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
      lesson_progress_percent:
        totalLessons > 0
          ? Math.floor((completedLessons / totalLessons) * 100)
          : 0,
    },
  };
}

export async function toggleLessonCompletion(
  lessonId: string,
  courseId: string,
  newStatus: 'InProgress' | 'Completed'
) {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: 'User not authenticated.' };

  const supabase = await createServerSupabase();

  const isCompleted = newStatus === 'Completed';
  const now = new Date().toISOString();

  const { data: progressData, error: progressError } =
    await supabase
      .from('user_lesson_progress')
      .upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          status: newStatus,
          completed_at: isCompleted ? now : null,
        },
        { onConflict: 'user_id,lesson_id' }
      )
      .select()
      .single();

  if (progressError) {
    return {
      success: false,
      error: `Failed to update progress: ${progressError.message}`,
    };
  }

  let courseCompleted = false;

  if (isCompleted) {
    const { data: courseData } = await fetchCourseLessons(
      supabase,
      courseId,
      userId
    );

    if (courseData) {
      const lessons = courseData.lessons || [];

      const allCompleted = lessons.every(
        (lesson) =>
          lesson.user_progress?.[0]?.status === 'Completed' ||
          lesson.user_progress?.[0]?.status === 'completed'
      );

      if (allCompleted) {
        courseCompleted = true;

        const xpReward = courseData.xp_reward || 0;

        if (xpReward > 0) {
          await updateXp(supabase, userId, xpReward);
        }

        await supabase
          .from('user_course_progress')
          .upsert(
            {
              user_id: userId,
              course_id: courseId,
              status: 'Completed',
              completed_at: now,
            },
            { onConflict: 'user_id,course_id' }
          );
      }
    }
  }

  revalidatePath(`/courses/${courseId}`);

  return {
    success: true,
    message: courseCompleted
      ? 'Congratulations! Course completed and XP awarded.'
      : isCompleted
      ? 'Lesson completed.'
      : 'Lesson marked as in progress.',
    progress: progressData,
    courseCompleted,
  };
}
