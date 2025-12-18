import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Tables } from "@/types/database.types";
import CourseCard from "@/components/StudentRoadmap/CourseCard";

async function calculateCourseProgress(
  supabase: any,
  courseId: string,
  userId: string
): Promise<number> {
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId);

  if (!lessons || lessons.length === 0) return 0;

  const lessonIds = lessons.map((l: any) => l.id);
  const { data: progress } = await supabase
    .from("user_lesson_progress")
    .select("status")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);

  if (!progress) return 0;

  const completedCount = progress.filter(
    (p: any) => p.status === "completed"
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
  const supabase = await createClient();

  // 1. Get User
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

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
    .select(
      `
      course_id,
      order_index,
      courses!inner (
        *
      )
    `
    )
    .eq("roadmap_id", roadmapId)
    .order("order_index", { ascending: true });

  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
  }

  const courses: Course[] = [];
  if (coursesData) {
    for (const c of coursesData) {
      const progress = await calculateCourseProgress(
        supabase,
        c.course_id,
        user.id
      );
      const courseData = c.courses as any;
      courses.push({
        ...courseData,
        course_id: c.course_id,
        summary: courseData.summary || null,
        donePercentage: progress,
      });
    }
  }

  const doneCount = courses.filter((c) => c.donePercentage === 100).length;

  return (
    <div className="min-h-screen max-w-[1400px] mx-auto px-10 py-25 flex flex-col gap-6 bg-bg">
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