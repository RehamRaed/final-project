"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import LessonSidebar from "@/components/lesson/LessonSidebar";

import LessonDetail from "@/components/lesson/LessonDetail";

interface Lesson {
  id: string;

  course_id: string;

  title: string;

  description: string;

  duration: number;

  status: "Not Started" | "In Progress" | "Completed";
}

export default function LessonsPage() {
  const { courseId } = useParams();

  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchLessons = async () => {
      setLoading(true);

      try {
        const { supabase } = await import("@/lib/supabase/client");

        const { data, error } = await supabase

          .from("lessons")

          .select("*")

          .eq("course_id", courseId)

          .order("order_index", { ascending: true });

        if (error) throw error;

        const lessonsData = (data || []).map((l: any) => ({
          ...l,

          status: "Not Started",
        }));

        setLessons(lessonsData);

        if (lessonsData.length > 0) setSelectedLesson(lessonsData[0]);
      } catch (err) {
        console.error("Error fetching lessons:", err);

        setLessons([]);
      }

      setLoading(false);
    };

    fetchLessons();
  }, [courseId]);

  const handleMarkDone = (lessonId: string) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, status: "Completed" } : l))
    );

    if (selectedLesson?.id === lessonId) {
      setSelectedLesson({ ...selectedLesson, status: "Completed" });
    }
  };

  if (loading)
    return (
      <p className="text-center py-20 text-gray-500 text-lg font-medium">
        Loading lessons...
      </p>
    );

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
