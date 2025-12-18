'use client';

import { useParams } from 'next/navigation';
import LessonsPageUI from './LessonsPageUI';
import useLessonsPage from '@/hooks/useLessonsPage';

export default function LessonPage() {
  const { courseId } = useParams();
  const courseIdStr = Array.isArray(courseId) ? courseId[0] : courseId;

  const {
    lessons,
    selectedLesson,
    setSelectedLesson,
    onMarkDone,
    courseTitle,
    loading,
  } = useLessonsPage(courseIdStr);

  return (
    <LessonsPageUI
      lessons={lessons}
      selectedLesson={selectedLesson}
      setSelectedLesson={setSelectedLesson}
      onMarkDone={onMarkDone}
      courseTitle={courseTitle}
      loading={loading}
      courseId={courseIdStr || ''}
    />
  );
}
