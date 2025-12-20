'use client'

import { Tables } from "@/types/database.types";
import { ArrowRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import CourseCard from "./CourseCard";

interface Course {
    course_id: string;
    title: string;
    summary: string;
    icon?: string;
}

interface CoursesSectionProps {
    courses: Course[];
    currentRoadmap: Tables<'roadmaps'> | null;
}

export default function CoursesSection({ courses, currentRoadmap }: CoursesSectionProps) {
    const router = useRouter();
    const pathname = usePathname();
    // const searchParams = useSearchParams(); // unused
    const hasMoreCourses = courses.length > 4;

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl hover:cursor-pointer font-bold text-primary">My Courses:</h2>
                {hasMoreCourses && currentRoadmap && (
                    <button
                        className="flex items-center gap-2 text-primary font-semibold hover:underline"
                        onClick={() =>
                            router.push(`/roadmaps/${currentRoadmap.id}`)
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
                            <div
                                key={course.course_id}
                                className="shrink-0 w-64 sm:w-72 lg:w-80 cursor-pointer"
                                onClick={() => {
                                    // نرسل fromDashboard=true اذا الكورس من داشبورد
                                    const fromDashboard = pathname.includes('/dashboard');
                                    const query = fromDashboard ? '?fromDashboard=true' : '';
                                    router.push(`/courses/${course.course_id}${query}`);
                                }}
                            >
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
