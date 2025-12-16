"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/database.types";
import { ArrowLeft, BookOpen, Clock, Award } from "lucide-react";
import Link from "next/link";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";

// Define types locally or import them if they are shared.
// Ideally, these specific composite types could be in a shared valid types file,
// but for now we ensure they are strictly defined here.
interface LessonWithProgress extends Tables<'lessons'> {
    user_progress: { status: string | null; completed_at: string | null }[] | null;
}

interface CourseDataWithLessons extends Tables<'courses'> {
    lessons: LessonWithProgress[] | null;
    // xp_reward is already in Tables<'courses'>
}

interface CoursePageClientProps {
    courseData: CourseDataWithLessons; // lesson_progress_percent is passed separately in original code? No, let's check usage.
    // The original code had: courseData: CourseData & { lesson_progress_percent: number };
    // Let's stick to the prop structure but clean the naming.
    lessonProgressPercent: number;
}

export default function CoursePageClient({
    courseData,
    lessonProgressPercent
}: CoursePageClientProps) {
    const router = useRouter();
    const lessons = courseData.lessons || [];

    const completedLessons = useMemo(
        () => lessons.filter(l => l.user_progress?.[0]?.status === 'completed').length,
        [lessons]
    );

    const totalDuration = useMemo(
        () => lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0),
        [lessons]
    );

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Courses', href: '/roadmaps' },
        { label: courseData.title }
    ];

    const handleStartLearning = () => {
        router.push(`/courses/${courseData.id}/lessons`);
    };

    return (
        <div className="min-h-screen max-w-[1300px] mx-auto px-10 pt-30 pb-20">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} className="mb-6" />

            {/* Header Section */}
            <header className="mb-8 border-b pb-6">
                <Link
                    href="/roadmaps"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors"
                    aria-label="Back to roadmaps"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Roadmaps
                </Link>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Course Icon/Thumbnail */}
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <BookOpen className="w-12 h-12 text-white" />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3" tabIndex={0}>
                            {courseData.title}
                        </h1>

                        {courseData.description && (
                            <p className="text-lg text-gray-600 mb-4">
                                {courseData.description}
                            </p>
                        )}

                        {/* Course Meta Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                            {courseData.instructor && (
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Instructor:</span>
                                    <span className="font-semibold">{courseData.instructor}</span>
                                </div>
                            )}

                            {courseData.level && (
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Level:</span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                        {courseData.level}
                                    </span>
                                </div>
                            )}

                            {totalDuration > 0 && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                                </div>
                            )}

                            {courseData.xp_reward && courseData.xp_reward > 0 && (
                                <div className="flex items-center gap-2 text-yellow-600">
                                    <Award className="w-4 h-4" />
                                    <span className="font-semibold">{courseData.xp_reward} XP</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Your Progress</span>
                        <span className="text-sm font-bold text-blue-600">{lessonProgressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${lessonProgressPercent}%` }}
                            role="progressbar"
                            aria-valuenow={lessonProgressPercent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        {completedLessons} of {lessons.length} lessons completed
                    </p>
                </div>
            </header>

            {/* Lessons Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Lessons</h2>

                {lessons.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">
                        No lessons available for this course yet.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {lessons.map((lesson, index) => {
                            const isCompleted = lesson.user_progress?.[0]?.status === 'completed';

                            return (
                                <div
                                    key={lesson.id}
                                    className={`p-5 rounded-xl border-2 transition-all ${isCompleted
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {isCompleted ? '✓' : index + 1}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                {lesson.title}
                                            </h3>

                                            {lesson.content && (
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                    {lesson.content}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                {lesson.duration && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {lesson.duration} min
                                                    </span>
                                                )}

                                                {lesson.type && (
                                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                        {lesson.type}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isCompleted && (
                                            <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                                                Completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Action Button */}
            {lessons.length > 0 && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleStartLearning}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 active:scale-95"
                    >
                        {lessonProgressPercent > 0 ? 'Continue Learning' : 'Start Learning'} →
                    </button>
                </div>
            )}
        </div>
    );
}
