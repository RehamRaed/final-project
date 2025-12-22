'use client';

import Link from 'next/link';
import { ArrowLeft } from "lucide-react";
import LessonsSidebar from '@/components/lessons/LessonsSidebar';
import LessonDetails from '@/components/lessons/LessonDetails';
import LoadingSpinner from '../ui/LoadingSpinner'; 
import { Tables } from '@/types/database.types';

export interface Lesson extends Tables<'lessons'> {
  status?: 'Completed' | 'InProgress' | 'Not Started';
  duration_minutes?: number | null;
}

interface Props {
  lessons: Lesson[];
  selectedLesson: Lesson | null;
  setSelectedLesson: (lesson: Lesson) => void;
  onMarkDone: (lessonId: string) => void;
  courseTitle: string;
  loading: boolean;
  courseId: string;
}

export default function LessonPageUI({
  lessons,
  selectedLesson,
  setSelectedLesson,
  onMarkDone,
  courseTitle,
  loading,
  courseId
}: Props) {

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='max-w-300 mx-auto pt-25 px-5 pb-10'>
      <Link
        href={`/roadmaps/${courseId}/courses`}
        className="flex items-center gap-1 font-semibold mb-5"
        style={{ color: "var(--color-primary)" }}
      >
        <ArrowLeft size={20} /> Back
      </Link>

      <div className="flex gap-6 flex-col md:flex-row">
        <LessonsSidebar
          lessons={lessons}
          selectedLessonId={selectedLesson?.id || null}
          onSelectLesson={setSelectedLesson}
          courseTitle={courseTitle}
        />

        <div className="flex-1">
          {selectedLesson ? (
            <LessonDetails
              lesson={selectedLesson}
              onMarkDone={onMarkDone}
              isMarkingDone={false}
            />
          ) : (
            <p className="text-gray-500">Select a lesson to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
