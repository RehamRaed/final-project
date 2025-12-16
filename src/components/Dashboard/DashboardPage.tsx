"use client";

import { useRouter } from "next/navigation";
import SelectedRoadmapCard from "@/components/Dashboard/SelectedRoadmapCard";
import CourseCard from "@/components/Dashboard/CourseCard";
import { ArrowRight, CheckCircle2, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Tables } from "@/types/database.types";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

// Define strict types for props
interface Course {
    course_id: string;
    title: string;
    summary: string;
    icon?: string;
}

interface DashboardPageProps {
    user: User;
    currentRoadmap: Tables<'roadmaps'> | null;
    courses: Course[];
    tasks: Tables<'tasks'>[];
}

export default function StudentHomePage({
    user,
    currentRoadmap,
    courses,
    tasks
}: DashboardPageProps) {
    const router = useRouter();

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
                            title={currentRoadmap?.title || "No Active Roadmap"}
                            description={currentRoadmap ? "This is your current roadmap. Keep progressing!" : "Select a roadmap to get started."}
                            color="var(--primary)"
                        />
                    </div>

                    {/* Upcoming Tasks Widget */}
                    <div className="lg:col-span-1 bg-card-bg rounded-xl shadow-md border border-border flex flex-col h-full">
                        <div className="p-5 border-b border-border flex justify-between items-center">
                            <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                Upcoming Tasks
                            </h3>
                            <Link href="/tasklist" className="text-xs font-medium text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
                                View All <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar max-h-[300px]">
                            {tasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <p className="text-text-primary font-medium">All caught up!</p>
                                    <p className="text-text-secondary text-xs mt-1">No pending tasks for now.</p>
                                    <Link href="/tasklist" className="mt-3 text-xs text-primary hover:underline">
                                        Create a Task
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {tasks.map((task) => (
                                        <div key={task.id} className="group p-3 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm hover:bg-bg transition-all duration-200">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-medium text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
                                                    {task.title}
                                                </h4>
                                                <span className={`
                                        text-[10px] px-2 py-0.5 rounded-full font-medium border
                                        ${task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-900/30' :
                                                        task.priority === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:border-orange-900/30' :
                                                            'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30'}
                                    `}>
                                                    {task.priority || 'Low'}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-xs text-text-secondary gap-2">
                                                {task.due_date && (
                                                    <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                                                        <CalendarIcon className="w-3 h-3" />
                                                        {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
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

                {courses.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">
                        No courses found for this roadmap.
                    </p>
                ) : (
                    <div className="overflow-x-auto scroll-smooth p-2 scrollbar-hide">
                        <div className="flex gap-4 w-max">
                            {courses.map((course) => (
                                <div key={course.course_id} className="shrink-0 w-64 sm:w-72 lg:w-80">
                                    <CourseCard course={course} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
