'use client';

import React, { useEffect, useState } from "react";
import Title from "../Title/title";
import LessonCard from "./LessonCard";
import LoadingSpinner from "../ui/LoadingSpinner";

type Lesson = {
  id: number;
  title: string;
  content?: string | null;
  timeRequired?: number | null;
  status?: string | null;
  duration?: number | null;
  order_index?: number | null;
};

type CourseType = {
  id: number;
  title: string;
  description?: string;
  lessons?: Lesson[];
};

export default function Course({ id }: { id: string }) {
  const [course, setCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchCourse() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/courses/${id}`);
        const json = await res.json();

        if (!res.ok) {
          const msg = json?.error?.message || "خطأ بجلب الكورس";
          throw new Error(msg);
        }

        // نفترض successResponse => { data: course }
        const data = json?.data ?? json;
        if (mounted) {
          // normalize lessons ordering
          if (data?.lessons && Array.isArray(data.lessons)) {
            data.lessons.sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0));
          }
          setCourse(data);
        }
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err.message || "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchCourse();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-8"><LoadingSpinner /> Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!course) return <div className="p-8">الكورس غير موجود</div>;
{console.log(course.title)}
  return (
    
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <Title title={course.title} />
        {course.description && <p className="text-sm text-gray-600 mt-2">{course.description}</p>}
      </div>

      <div className="space-y-4">
        {course.lessons && course.lessons.length > 0 ? (
          course.lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={{
              id: lesson.id,
              title: lesson.title,
              content: lesson.content ?? "لا يوجد محتوى متاح حالياً",
              timeRequired: lesson.timeRequired ?? lesson.duration ?? 0,
              status: lesson.status ?? "Not Started"
            }} />
          ))
        ) : (
          <div className="p-6 bg-white rounded shadow text-gray-600">لا توجد دروس حالياً لهذا الكورس</div>
        )}
      </div>
    </div>
  );
}
