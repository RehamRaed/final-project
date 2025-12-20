import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Tables } from '@/types/database.types';

export interface Lesson extends Tables<'lessons'> {
  status?: 'Completed' | 'InProgress' | 'Not Started';
  duration_minutes?: number | null;
}

export default function useLessonsPage(courseId?: string | null) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const courseIdStr = courseId ?? null;

  useEffect(() => {
    let mounted = true;
    const fetchLessons = async () => {
      if (!courseIdStr) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', courseIdStr)
          .order('order_index', { ascending: true });

        if (!mounted) return;

        if (error) {
          console.error('Failed to fetch lessons', error);
          setLessons([]);
        } else {
          setLessons((data as Lesson[]) || []);
        }
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setLessons([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void fetchLessons();

    return () => {
      mounted = false;
    };
  }, [courseIdStr]);

  const onMarkDone = async (lessonId: string) => {
    try {
      await supabase.from('user_lesson_progress').upsert({ lesson_id: lessonId, completed_at: new Date().toISOString() });
      // update local state safely and set selected lesson from the updated list
      setLessons(prev => {
        const updated: Lesson[] = prev.map((l) =>
          l.id === lessonId ? ({ ...l, status: 'Completed' as const }) : l
        );
        setSelectedLesson((updated.find((l) => l.id === lessonId) as Lesson) || null);
        return updated;
      });
    } catch (err) {
      console.error('Failed to mark lesson done', err);
    }
  };

  return {
    lessons,
    selectedLesson,
    setSelectedLesson,
    onMarkDone,
    courseTitle: '',
    loading,
  };
}
