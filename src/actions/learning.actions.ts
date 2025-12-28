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
import type { ActionResponse } from '@/types/actionResponse';

async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
}

// ======== Roadmaps ========
type RoadmapWithStatus = Tables<'roadmaps'> & {
  course_count: number;
  is_current: boolean;
};

export async function getRoadmapsListAction(): Promise<ActionResponse<unknown>> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: 'User not authenticated.' };

  const supabase = await createServerSupabase();

  const { data: roadmapsData, error: roadmapsError } =
    await fetchAllRoadmapsWithCourseCount(supabase);
  if (roadmapsError) return { success: false, error: roadmapsError.message };

  const { data: profileData } = await fetchUserCurrentRoadmap(supabase, userId);
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

export async function getRoadmapDetailsAction(roadmapId: string): Promise<ActionResponse<unknown>> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: 'User not authenticated.' };

  const supabase = await createServerSupabase();

  const { data, error } = await fetchRoadmapDetails(supabase, roadmapId, userId);
  if (error) return { success: false, error: error.message };
  if (!data) return { success: false, error: 'Roadmap not found.' };

  const coursesInRoadmap = data.roadmap_courses || [];
  const completedCourses = coursesInRoadmap.filter(
    (rc) => rc.course?.user_progress?.[0]?.status === 'completed'
  ).length;
  const totalCourses = coursesInRoadmap.length;
  const progressPercent = totalCourses > 0 ? Math.floor((completedCourses / totalCourses) * 100) : 0;

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

// ======== Update Current Roadmap ========
export async function updateCurrentRoadmapAction(newRoadmapId: string): Promise<ActionResponse<unknown>> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: 'User not authenticated.' };

  const supabase = await createServerSupabase();

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ current_roadmap_id: newRoadmapId })
    .eq('id', userId);
  if (profileError) return { success: false, error: profileError.message };

  const { error: metaError } = await supabase.auth.updateUser({
    data: { has_selected_roadmap: true }
  });
  if (metaError) return { success: false, error: metaError.message };

  revalidatePath('/roadmaps');
  revalidatePath('/dashboard');

  return { success: true, message: 'Roadmap updated successfully.' };
}

// ======== Lessons ========
export async function getCourseLessonsAction(courseId: string): Promise<ActionResponse<unknown>> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: 'User not authenticated.' };

  const supabase = await createServerSupabase();
  const { data, error } = await fetchCourseLessons(supabase, courseId, userId);
  if (error) return { success: false, error: error.message };
  if (!data) return { success: false, error: 'Course not found.' };

  const lessonsInCourse = data.lessons || [];
  const totalLessons = lessonsInCourse.length;
  const completedLessons = lessonsInCourse.filter(
    (l) => l.user_progress?.[0]?.status?.toLowerCase() === 'completed'
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
      lesson_progress_percent: totalLessons > 0 ? Math.floor((completedLessons / totalLessons) * 100) : 0,
    },
  };
}

// ======== Toggle Lesson Completion ========
export async function toggleLessonCompletion(
  lessonId: string,
  courseId: string,
  newStatus: 'InProgress' | 'Completed'
): Promise<ActionResponse<unknown>> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: 'User not authenticated.' };

  const supabase = await createServerSupabase();
  const isCompleted = newStatus === 'Completed';
  const now = new Date().toISOString();

  const { data: progressData, error: progressError } =
    await supabase
      .from('user_lesson_progress')
      .upsert(
        { user_id: userId, lesson_id: lessonId, status: newStatus, completed_at: isCompleted ? now : null },
        { onConflict: 'user_id,lesson_id' }
      )
      .select()
      .single();

  if (progressError) return { success: false, error: progressError.message };

  try {
    const { data: lessonsForCourse } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId);

    const lessonIds = lessonsForCourse?.map((l: { id: string }) => l.id) || [];
    if (lessonIds.length > 0) {
      const { data: userProgressRows } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id,status')
        .eq('user_id', userId)
        .in('lesson_id', lessonIds);

      const completedCount = userProgressRows?.filter((r: { status: string | null }) => r.status?.toLowerCase() === 'completed').length || 0;
      const total = lessonIds.length;
      const donePercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

      const { data: existingCourseProgress } = await supabase
        .from('user_course_progress')
        .select('started_at')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      const startedAtToSet = existingCourseProgress?.started_at ?? (donePercentage > 0 ? now : null);

      await supabase
        .from('user_course_progress')
        .upsert(
          {
            user_id: userId,
            course_id: courseId,
            status: donePercentage === 100 ? 'Completed' : 'InProgress',
            completed_at: donePercentage === 100 ? now : null,
            started_at: startedAtToSet,
          },
          { onConflict: 'user_id,course_id' }
        );
    }
  } catch {
  }

  revalidatePath(`/courses/${courseId}`);
  revalidatePath(`/courses/${courseId}/lessons`);
  revalidatePath('/student/roadmaps');
  revalidatePath('/roadmaps');

  return {
    success: true,
    message: isCompleted ? 'Lesson completed.' : 'Lesson marked as in progress.',
    data: { progress: progressData, courseCompleted: isCompleted },
  };
}
