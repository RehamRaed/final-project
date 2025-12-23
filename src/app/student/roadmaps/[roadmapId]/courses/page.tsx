"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { supabase } from '@/lib/supabase/client';
import CourseCard from "@/components/StudentRoadmap/CourseCard";

import { Tables } from "@/types/database.types";

interface Course extends Tables<'courses'> {
  course_id: string; 
  donePercentage: number;
  summary: string | null;
}

export default function RoadmapCoursesPage() {
  const currentRoadmap = useSelector(
    (state: RootState) => state.roadmap.current
  );

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDoneOnly, setShowDoneOnly] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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

  useEffect(() => {
    if (!currentRoadmap?.id || !userId) return; 

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { supabase } = await import("@/lib/supabase/client");

        const { data: coursesData, error: coursesError } = await supabase
          .from("roadmap_courses")
          .select(`
          course_id,
          order_index,
          courses!inner (
            title,
            description,
            summary,
            instructor
          )
        `)
          .eq("roadmap_id", currentRoadmap.id)
          .order("order_index", { ascending: true });

        if (coursesError) throw coursesError;

        const courseIds = coursesData.map(c => c.course_id);
        const { data: progressData, error: progressError } = await supabase
          .from("user_course_progress")
          .select("course_id, done_percentage")
          .eq("user_id", userId)
          .in("course_id", courseIds);

        if (progressError) throw progressError;

      
        const formatted: Course[] = coursesData.map((c) => {
          const course = c.courses as unknown as Tables<'courses'>;
          const progress = progressData.find(p => p.course_id === c.course_id);
          return {
            ...course,
            course_id: c.course_id,
            donePercentage: progress?.done_percentage ?? 0,
          };
        });

        setCourses(formatted);

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error("Error fetching courses:", message);
        setCourses([]);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [currentRoadmap, userId]);

  if (!currentRoadmap) {
    return (
      <p className="text-center py-10 text-gray-500">
        Please select a roadmap first.
      </p>
    );
  }

  const filteredCourses = showDoneOnly
    ? courses.filter((c) => c.donePercentage === 100)
    : courses;

  const doneCount = courses.filter((c) => c.donePercentage === 100).length;

  return (
    <div className="min-h-screen max-w-350 mx-auto px-10 py-25 flex flex-col gap-6 bg-bg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="font-bold text-primary lg:text-2xl md:text-xl">
          My Roadmap Courses
          {showDoneOnly && (
            <span className="text-green-500 text-sm ml-2">
              / Done Courses ({doneCount})
            </span>
          )}
        </h2>

        <button
          onClick={() => setShowDoneOnly(!showDoneOnly)}
          className={`px-4 py-2 rounded-lg text-white font-medium transition cursor-pointer ${showDoneOnly
            ? "bg-gray-500"
            : "bg-primary hover:opacity-90"
            }`}
        >
          {showDoneOnly ? "Show All" : "Filter Done"}
        </button>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">
          Loading courses...
        </p>
      ) : filteredCourses.length === 0 ? (
        <p className="text-center py-10 text-gray-500">
          {showDoneOnly
            ? "No completed courses found."
            : "No courses found for this roadmap."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 mt-4">
          {filteredCourses.map((course) => (
            <CourseCard key={course.course_id} course={course as any} href={`/roadmaps/${currentRoadmap.id}/courses/${course.course_id}`} />
          ))}
        </div>
      )}
    </div>
  );
}