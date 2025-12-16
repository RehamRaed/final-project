'use client';

import Link from 'next/link';
import { User } from "@supabase/supabase-js";
import TasksSection from "@/components/Dashboard/TasksSection";
import CoursesSection from "@/components/Dashboard/CoursesSection";
import SelectedRoadmapCard from "@/components/Dashboard/SelectedRoadmapCard";
import { Tables } from "@/types/database.types";

interface Course {
    course_id: string;
    title: string;
    summary: string;
    icon?: string;
}

interface TaskDashboardProps {
    user: User;
    currentRoadmap: Tables<'roadmaps'> | null;
    courses: Course[];
    tasks: Tables<'tasks'>[];
}

export default function TaskDashboard({
    user,
    currentRoadmap,
    courses,
    tasks
}: TaskDashboardProps) {
    const displayName =
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "Student";

    return (
        <div className="bg-bg min-h-screen">
            <div className="max-w-350 mx-auto px-4 pt-25 space-y-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 p-6 bg-card-bg rounded-xl shadow-md border border-border space-y-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
                            Welcome, <span className="text-primary">{displayName}!</span>
                        </h1>
                        <p className="text-text-secondary text-sm font-medium">
                            Every step you take brings you closer to mastering your roadmap
                        </p>

                        <SelectedRoadmapCard
                            title={currentRoadmap?.title || "No Active Roadmap"}
                            description={currentRoadmap ? (
                                <div className="flex items-center gap-3">
                                    <span>This is your current roadmap , </span>
                                    <Link href={`/roadmaps/${currentRoadmap.id}`} className="ml-2 inline-block">
                                        <button className="px-3 py-1 bg-primary hover:cursor-pointer text-white rounded-md text-sm">Keep progressing!</button>
                                    </Link>
                                </div>
                            ) : "Select a roadmap to get started."}
                            color="var(--primary)"
                        />
                    </div>

<<<<<<< HEAD
                    <TasksSection tasks={tasks} />
=======
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

  const hasMoreCourses = courses.length > 4;

  return (
    <div className="bg-bg min-h-screen pt-25">
      <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 bg-card-bg rounded-xl shadow-md border border-border space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
              Welcome, <span className="text-primary">{displayName}!</span>
            </h1>

            <p className="text-text-secondary text-sm font-medium">
              Every step you take brings you closer to mastering your roadmap
            </p>

            <SelectedRoadmapCard
              title={currentRoadmap?.title || "loading..."}
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
                router.push(`/student/roadmaps/${currentRoadmap.id}/courses`)
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
          <div className="overflow-x-auto scroll-smooth p-2 scrollbar-hide">
            <div className="flex gap-4 w-max">
              {courses.map((course) => (
                <div key={course.course_id} className="shrink-0 w-64 sm:w-72 lg:w-80">
                  <CourseCard course={course} />
>>>>>>> 567d61e (fix: update router link for roadmap courses)
                </div>

                <CoursesSection courses={courses} currentRoadmap={currentRoadmap} />
            </div>
        </div>
    );
}
