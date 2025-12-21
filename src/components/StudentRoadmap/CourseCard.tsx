"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tables } from "@/types/database.types";
import ProgressBar from "./ProgressBar";
import { supabase } from '@/lib/supabase/client';

interface CourseWithProgress extends Tables<'courses'> {
  summary: string | null;
  donePercentage: number;
}

interface CourseCardProps {
  course: CourseWithProgress;
  href: string;
}

export default function CourseCard({ course, href }: CourseCardProps) {
  const [localPercent, setLocalPercent] = useState<number>(course.donePercentage ?? 0);

  useEffect(() => {
    let mounted = true;

    const dbCourseId = (course as { id?: string; course_id?: string }).id ?? (course as { id?: string; course_id?: string }).course_id;

    async function fetchProgress() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData?.user?.id;
        if (!userId) return;

        // Try reading a dedicated course progress row first
        const { data: cpRow } = await supabase
          .from('user_course_progress')
          .select('done_percentage')
          .eq('user_id', userId)
          .eq('course_id', dbCourseId)
          .single();

        if (cpRow && typeof cpRow.done_percentage === 'number') {
          if (mounted) setLocalPercent(cpRow.done_percentage as number);
          return;
        }

        // Fallback: compute from lessons and user_lesson_progress
        const { data: lessons } = await supabase
          .from('lessons')
          .select('id')
          .eq('course_id', dbCourseId);

        const lessonIds = (lessons || []).map((l: { id: string }) => l.id).filter(Boolean);
        if (lessonIds.length === 0) {
          if (mounted) setLocalPercent(0);
          return;
        }

        const { data: rows } = await supabase
          .from('user_lesson_progress')
          .select('lesson_id, status')
          .eq('user_id', userId)
          .in('lesson_id', lessonIds);

        const completed = (rows || []).filter((r: { status: string | null }) => r.status === 'Completed' || r.status === 'completed').length;
        const percent = Math.round((completed / lessonIds.length) * 100);
        if (mounted) setLocalPercent(percent);
      } catch {
        // ignore errors silently for UI
      }
    }

    // initial fetch and polling to update automatically
    fetchProgress();
    const interval = setInterval(fetchProgress, 3000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [course]);

  return (
    <Link
      href={href}
      className="flex flex-col md:flex-row gap-0 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        borderColor: 'var(--color-border)',
      }}
      role="article"
      aria-label={`Go to course ${course.title}. Completion status: ${course.donePercentage} percent.`}
    >
      <div
        className="text-white p-6 flex flex-col justify-center md:w-1/4 rounded-l-xl transition-colors duration-300"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <p className="text-xs opacity-90 uppercase tracking-wider font-medium text-white">Course</p>
        <h3 className="text-lg font-bold mt-1 text-white" tabIndex={0}>
          {course.title}
        </h3>
        <p className="text-sm mt-2 opacity-90 line-clamp-2 text-white">
          {course.summary || 'No summary available.'}
        </p>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Instructor: <span className="font-semibold">{course.instructor || 'Not specified'}</span>
          </p>
          <div className="w-full sm:w-2/5" aria-label={`Progress bar: ${localPercent}% completed`}>
            <ProgressBar donePercentage={localPercent} />
          </div>
        </div>

        <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
          {course.description}
        </p>

        <div className="flex justify-end">
          <span
            className={`
              px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5
              ${localPercent === 100 ? 'bg-accent' : 'bg-primary hover:bg-primary-hover'}
            `}
          >
            {localPercent === 100 ? "Completed ✓" : "Continue →"}
          </span>
        </div>
      </div>
    </Link>
  );
}
