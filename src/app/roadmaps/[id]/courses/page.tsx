"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import RoadmapCourseCard from "@/components/StudentRoadmap/RoadmapCourseCard";

interface Course {
  course_id: string;
  title: string;
  description: string;
  donePercentage: number;
}

export default function RoadmapCoursesPage() {
  const params = useParams();
  const roadmapId = params.id;

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDoneOnly, setShowDoneOnly] = useState(false);

  useEffect(() => {
    if (!roadmapId) return;

    async function fetchCourses() {
      setLoading(true);
      try {
        const { supabase } = await import("@/lib/supabase/client");

        const { data, error } = await supabase
          .from("roadmap_courses")
          .select(`
            course_id,
            order_index,
            courses!inner (
              title,
              description,
              donePercentage
            )
          `)
          .eq("roadmap_id", roadmapId)
          .order("order_index", { ascending: true });

        if (error) throw error;

        const formatted = (data as any[]).map((item) => ({
          course_id: item.course_id,
          title: item.courses.title,
          description: item.courses.description,
          donePercentage: item.courses.donePercentage ?? 0,
        }));

        setCourses(formatted);
      } catch (err: any) {
        console.error("Error fetching courses:", err.message);
        setCourses([]);
      }
      setLoading(false);
    }

    fetchCourses();
  }, [roadmapId]);

  const filteredCourses = showDoneOnly
    ? courses.filter((c) => c.donePercentage === 100)
    : courses;

  const doneCount = courses.filter((c) => c.donePercentage === 100).length;

  const noCoursesMessage =
    filteredCourses.length === 0
      ? showDoneOnly
        ? "No completed courses found."
        : "No courses found for this roadmap."
      : null;

  if (loading)
    return (
      <p className="p-6 text-center text-gray-600 text-lg font-medium">
        Loading courses...
      </p>
    );

  return (
    <div className="min-h-screen max-w-[1300px] mx-auto mt-30 flex flex-col gap-6 bg-bg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="font-bold text-primary">
          My Roadmap Courses{" "}
          {showDoneOnly && (
            <span className="text-[16px] text-[#10B981]">
              / Done Courses ({doneCount})
            </span>
          )}
        </h2>

        <FilterButton
          showDoneOnly={showDoneOnly}
          setShowDoneOnly={setShowDoneOnly}
        />
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {noCoursesMessage ? (
          <p className="text-center text-gray-500 text-lg py-10">
            {noCoursesMessage}
          </p>
        ) : (
          filteredCourses.map((course) => (
            <RoadmapCourseCard key={course.course_id} course={course} />
          ))
        )}
      </div>
    </div>
  );
}

const FilterButton = ({
  showDoneOnly,
  setShowDoneOnly,
}: {
  showDoneOnly: boolean;
  setShowDoneOnly: (val: boolean) => void;
}) => (
  <button
    onClick={() => setShowDoneOnly(!showDoneOnly)}
    style={{ backgroundColor: showDoneOnly ? "gray" : "var(--primary)" }}
    className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
  >
    {showDoneOnly ? "Show All" : "Filter Done"}
  </button>
);
