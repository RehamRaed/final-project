import { createServerSupabase } from "@/lib/supabase/server"; 
import { redirect } from "next/navigation";
import { Tables } from "@/types/database.types";
import type { SupabaseClient } from '@supabase/supabase-js';
import CourseCard from "@/components/StudentRoadmap/CourseCard";
import { SupabaseClient } from "@supabase/supabase-js";

async function calculateCourseProgress(
  supabase: SupabaseClient,
  courseId: string,
  userId: string
): Promise<number> {
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId);

  if (!lessons || lessons.length === 0) return 0;

<<<<<<< HEAD
  const lessonIds = (lessons as Tables<'lessons'>[]).map((l) => l.id);
=======
  const lessonIds = lessons.map((l) => l.id);
>>>>>>> dcd39adeaeefa06a39def405789363ac2c75ec79
  const { data: progress } = await supabase
    .from("user_lesson_progress")
    .select("status")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds as string[]);

  if (!progress) return 0;

<<<<<<< HEAD
  const completedCount = (progress as Tables<'user_lesson_progress'>[]).filter(
    (p) => p.status === "completed"
=======
  const completedCount = progress.filter(
    (p) => p.status?.toLowerCase() === "completed"
>>>>>>> dcd39adeaeefa06a39def405789363ac2c75ec79
  ).length;

  return Math.round((completedCount / lessons.length) * 100);
}

interface Course extends Tables<'courses'> {
  course_id: string;
  summary: string | null;
  donePercentage: number;
}

interface PageProps {
  params: Promise<{ roadmapId: string }>;
}

export default async function RoadmapCoursesPage({ params }: PageProps) {
  const { roadmapId } = await params;
  
  const supabase = await createServerSupabase();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("id", roadmapId)
    .single();

  if (!roadmap) {
    redirect("/roadmaps");
  }

  const { data: coursesData, error: coursesError } = await supabase
    .from("roadmap_courses")
    .select(`
      course_id,
      order_index,
      courses!inner (*)
    `)
    .eq("roadmap_id", roadmapId)
    .order("order_index", { ascending: true });

  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
  }

  const courses: Course[] = [];
  
  if (coursesData) {
    for (const c of coursesData) {
      const progress = await calculateCourseProgress(supabase, c.course_id, user.id);

      const rawCourse = c.courses as unknown as Tables<'courses'>;

      courses.push({
        ...rawCourse,
        course_id: c.course_id,
        summary: (rawCourse as any).summary || null,
        donePercentage: progress,
      });
    }
  }

  const doneCount = courses.filter((c) => c.donePercentage === 100).length;

  return (
<<<<<<< HEAD
    <div className="min-h-screen max-w-7xl mx-auto px-10 py-25 flex flex-col gap-6 bg-bg">
=======
    <div className="min-h-screen max-w-34 mx-auto px-10 py-25 flex flex-col gap-6 bg-bg">
>>>>>>> dcd39adeaeefa06a39def405789363ac2c75ec79
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="font-bold text-primary lg:text-2xl md:text-xl">
          {roadmap.title} - Courses
        </h2>
        <div className="text-sm text-text-secondary">
          {doneCount} of {courses.length} completed
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-2">No courses found</p>
          <p className="text-gray-400 text-sm">
            This roadmap doesn&apos;t have any courses yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 mt-4">
          {courses.map((course) => (
            <CourseCard
              key={course.course_id}
              course={course}
              href={`/courses/${course.course_id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}