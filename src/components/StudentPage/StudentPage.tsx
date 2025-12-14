"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SelectedRoadmapCard from "@/components/StudentRoadmap/SelectedRoadmapCard";
import CourseCard from "@/components/StudentPage/CourseCard"; // الكارد البسيط
import MiniToDoCard from "@/components/ToDos/MiniToDoCard";
import { ToDoItem } from "@/types/todo";
import { ArrowRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Course {
  course_id: string;
  title: string;
  summary: string;
  icon?: string;
}

const mockTasks: ToDoItem[] = [
  { id: 1, task: "Complete Next.js Setup Module", status: "In Progress" },
  { id: 2, task: "Read Tailwind CSS Documentation", status: "In Progress" },
  { id: 3, task: "Watch Redux Toolkit Lecture", status: "In Progress" },
  { id: 4, task: "Practice TypeScript Interfaces", status: "Done" },
  { id: 5, task: "Design Database Schema", status: "In Progress" },
];

export default function StudentHomePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [currentRoadmap, setCurrentRoadmap] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const loadUserAndRoadmap = async () => {
      const { supabase } = await import("@/lib/supabase/client");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_roadmap_id, roadmaps(*)")
        .eq("id", user.id)
        .single();

      if (profile?.roadmaps) {
        setCurrentRoadmap(profile.roadmaps);
      }
    };

    loadUserAndRoadmap();
  }, []);

  useEffect(() => {
    if (!currentRoadmap?.id) return;

    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const { supabase } = await import("@/lib/supabase/client");

        const { data, error } = await supabase
          .from("roadmap_courses")
          .select(`
            course_id,
            order_index,
            courses!inner (
              title,
              summary,
              icon
            )
          `)
          .eq("roadmap_id", currentRoadmap.id)
          .order("order_index");

        if (error) throw error;

        setCourses(
          (data as any[]).map((item) => ({
            course_id: item.course_id,
            title: item.courses.title,
            summary: item.courses.summary,
            icon: item.courses.icon,
          }))
        );
      } catch {
        setCourses([]);
      }
      setLoadingCourses(false);
    };

    fetchCourses();
  }, [currentRoadmap]);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Student";

  const visibleCourses = courses.slice(0, 4);
  const hasMoreCourses = courses.length > 4;

  return (
    <div className="bg-bg min-h-screen pt-[90px]">
      <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 bg-card-bg rounded-xl shadow-md border border-border space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
              Welcome, <span className="text-primary">{displayName}!</span>
            </h1>

            <p className="text-text-secondary text-sm font-medium">
              Every step you take brings you closer to mastering your roadmap
            </p>

            <SelectedRoadmapCard
              title={currentRoadmap?.title || "No roadmap selected"}
              description="This is your current roadmap. Keep progressing!"
              color="var(--primary)"
            />
          </div>

          <MiniToDoCard tasks={mockTasks} />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">My Courses:</h2>
          {hasMoreCourses && currentRoadmap && (
            <button
              className="flex items-center gap-2 text-primary font-semibold hover:underline"
              onClick={() =>
                router.push(`/roadmaps/${currentRoadmap.id}/courses`)
              }
            >
              Show More <ArrowRight size={18} />
            </button>
          )}
        </div>

        {loadingCourses ? (
          <p className="text-gray-500 text-center py-10">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No courses found for this roadmap.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleCourses.map((course) => (
              <CourseCard key={course.course_id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
