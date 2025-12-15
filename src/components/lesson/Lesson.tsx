'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LessonSidebar from '@/components/lesson/LessonSidebar';
import LessonDetail from '@/components/lesson/LessonDetail';
import { Lesson } from '@/types/lesson';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function LessonComponent() {
  const { courseId } = useParams();

  const [userId, setUserId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [donePercentage, setDonePercentage] = useState(0);
  //Get logged-in user
  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        console.error('User not authenticated');
        return;
      }
      setUserId(data.user.id);
    };

    loadUser();
  }, []);

  // Fetch lessons after user & courseId exist
  useEffect(() => {
    if (!courseId || !userId) return;

    const fetchLessons = async () => {
        setLoading(true);
        try {
            //Lessons
            const { data: lessonsData, error: lessonsError } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index', { ascending: true });

            if (lessonsError) throw lessonsError;
            if (!lessonsData || lessonsData.length === 0) {
            setLessons([]);
            return;
            }

            //Progress
            const lessonIds = lessonsData.map(l => l.id);

            const { data: progressData, error: progressError } = await supabase
            .from('user_lesson_progress')
            .select('lesson_id, status')
            .eq('user_id', userId)
            .in('lesson_id', lessonIds);

            if (progressError) throw progressError;

            //Merge Lessons with Progress
            const progressMap = new Map(
            (progressData || []).map(p => [p.lesson_id, p.status])
            );

            const lessonsWithStatus = lessonsData.map((lesson) => ({
            ...lesson,
            status: progressMap.get(lesson.id) ?? 'Not Started',
            }));

            setLessons(lessonsWithStatus);
            setSelectedLesson(lessonsWithStatus[0] || null);
        } catch (err) {
            console.error('Error fetching lessons:', err);
            setLessons([]);
        }
        setLoading(false);
        };


    fetchLessons();
  }, [courseId, userId]);

  const handleMarkDone = async (lessonId: string) => {
    if (!userId || !courseId) return;

    try {
      const now = new Date().toISOString();

      //Mark lesson completed
      const { error: lessonError } = await supabase
        .from('user_lesson_progress')
        .upsert(
          { user_id: userId, lesson_id: lessonId, status: 'Completed', completed_at: now },
          { onConflict: 'user_id,lesson_id' }
        );
      if (lessonError) throw lessonError;

      //Update local state
      const updatedLessons = lessons.map(l =>
        l.id === lessonId ? { ...l, status: 'Completed' as Lesson['status'] } : l
      );
      setLessons(updatedLessons);

      if (selectedLesson?.id === lessonId) {
        setSelectedLesson({ ...selectedLesson, status: 'Completed' as Lesson['status'] });
      }

      //Calculate donePercentage
      const completedCount = updatedLessons.filter(l => l.status === 'Completed').length;
      const newDonePercentage = Math.round((completedCount / updatedLessons.length) * 100);
      setDonePercentage(newDonePercentage);

      //Upsert course progress for the correct user
      const { error: courseError } = await supabase
        .from('user_course_progress')
        .upsert(
          {
            user_id: userId,
            course_id: courseId,
            status: newDonePercentage === 100 ? 'Completed' : 'InProgress',
            done_percentage: newDonePercentage,
            completed_at: newDonePercentage === 100 ? now : null,
          },
          { onConflict: 'user_id,course_id' }
        );

      if (courseError) throw courseError;
      // Show notifcation
      const lessonTitle = lessons.find(l => l.id === lessonId)?.title || 'Lesson';
      toast.success(`"${lessonTitle}" marked as completed!`);

      if(newDonePercentage === 100){
        toast.success('Congratulations! You have completed the course!');
      }

    } catch (err) {
      console.error('Error marking lesson done:', err);
      toast.error('Failed to mark lesson as done');
    }
  };



  return (
    <div className="flex max-w-7xl mx-auto px-4 py-20 gap-6">
      <LessonSidebar
        lessons={lessons}
        selectedLessonId={selectedLesson?.id || null}
        onSelectLesson={setSelectedLesson}
      />
      <div className="flex-1">
        {selectedLesson ? (
          <LessonDetail lesson={selectedLesson} onMarkDone={handleMarkDone} />
        ) : (
          <p className="text-gray-500">Select a lesson to view details.</p>
        )}
      </div>
    </div>
  );
}
