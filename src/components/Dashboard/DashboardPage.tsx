"use client";

import Link from "next/link";
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
  currentRoadmap: Tables<"roadmaps"> | null;
  courses: Course[];
  tasks: Tables<"tasks">[];
}

export default function TaskDashboard({
  user,
  currentRoadmap,
  courses,
  tasks,
}: TaskDashboardProps) {
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";

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
              title={currentRoadmap?.title}
              description={
                currentRoadmap ? (
                  <div className="flex items-center gap-3">
                    <span>This is your current roadmap, </span>
                    <Link
                      href={`/roadmaps/${currentRoadmap.id}`}
                      className="ml-2 inline-block"
                    >
                      <button className="cursor-pointer px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 transition">
                        Keep progressing!
                      </button>
                    </Link>
                  </div>
                ) : (
                  "You haven't selected a learning path yet. Start your journey now!"
                )
              }
              color="var(--color-primary)"
              userId={user.id}
              roadmapId={currentRoadmap?.id}
            />
          </div>

          <TasksSection tasks={tasks} />
        </div>

        <CoursesSection courses={courses} currentRoadmap={currentRoadmap} />
      </div>
    </div>
  );
}
