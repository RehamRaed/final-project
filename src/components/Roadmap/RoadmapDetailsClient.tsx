"use client";

import { useState, useMemo } from "react";
import CourseCard from "@/components/StudentRoadmap/CourseCard";
import { Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Tables } from "@/types/database.types";
import Breadcrumbs, { BreadcrumbItem } from "@/components/ui/Breadcrumbs";

// Define strict local interface for the transformed course object passed to the client
interface RoadmapCourseForClient extends Tables<'courses'> {
    summary: string | null;
    order_index: number | null;
    donePercentage: number;
}

interface RoadmapDetailsClientProps {
    roadmapTitle: string;
    roadmapDescription: string | null;
    initialCourses: RoadmapCourseForClient[];
    progressPercent: number;
}

export default function RoadmapDetailsClient({
    roadmapTitle,
    roadmapDescription,
    initialCourses,
    progressPercent
}: RoadmapDetailsClientProps) {
    const [showDoneOnly, setShowDoneOnly] = useState(false);

    const doneCount = useMemo(() =>
        initialCourses.filter(c => c.donePercentage === 100).length
        , [initialCourses]);

    const filteredCourses = useMemo(() => {
        return showDoneOnly
            ? initialCourses.filter(c => c.donePercentage === 100)
            : initialCourses;
    }, [initialCourses, showDoneOnly]);

    const noCoursesMessage = filteredCourses.length === 0
        ? showDoneOnly
            ? "No completed courses yet."
            : "No courses available in this roadmap."
        : null;

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Roadmaps', href: '/roadmaps' },
        { label: roadmapTitle }
    ];

    return (
        <div className="min-h-screen max-w-[1300px] mx-auto px-10 pt-30" aria-label={`Courses for roadmap: ${roadmapTitle}`}>
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} className="mb-6" />

            {/* Header Section */}
            <header className="mb-8 border-b pb-6">
                <Link
                    href="/roadmaps"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 font-medium transition-colors"
                    aria-label="Back to roadmaps selection"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Roadmaps
                </Link>

                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2" tabIndex={0}>
                    {roadmapTitle}
                </h1>

                {roadmapDescription && (
                    <p className="text-lg text-gray-600 mb-3">
                        {roadmapDescription}
                    </p>
                )}

                <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                            <span className="text-sm font-bold text-blue-600">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                                role="progressbar"
                                aria-valuenow={progressPercent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                    </div>

                    <div className="text-center px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-gray-600 font-medium">Completed</p>
                        <p className="text-lg font-bold text-blue-600">{doneCount}/{initialCourses.length}</p>
                    </div>
                </div>
            </header>

            {/* Courses Section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 border-b pb-4">
                    <h2 className="font-bold text-2xl text-gray-700" id="course-list-title">
                        Roadmap Courses
                        {showDoneOnly && (
                            <span className="text-lg text-green-600 ml-2">
                                / Completed ({doneCount})
                            </span>
                        )}
                    </h2>

                    <FilterButton
                        showDoneOnly={showDoneOnly}
                        setShowDoneOnly={setShowDoneOnly}
                        doneCount={doneCount}
                    />
                </div>

                <section aria-labelledby="course-list-title" className="flex flex-col gap-4 mt-4">
                    {noCoursesMessage ? (
                        <p className="text-center text-gray-500 text-lg py-10" aria-live="polite">
                            {noCoursesMessage}
                        </p>
                    ) : (
                        filteredCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                href={`/courses/${course.id}`}
                            />
                        ))
                    )}
                </section>
            </div>
        </div>
    );
}

const FilterButton = ({
    showDoneOnly,
    setShowDoneOnly,
    doneCount
}: {
    showDoneOnly: boolean;
    setShowDoneOnly: (val: boolean) => void;
    doneCount: number;
}) => (
    <button
        onClick={() => setShowDoneOnly(!showDoneOnly)}
        disabled={!showDoneOnly && doneCount === 0}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-white font-semibold shadow-md
            ${showDoneOnly
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-blue-600 hover:bg-blue-700"
            }
            ${!showDoneOnly && doneCount === 0 ? "opacity-60 cursor-not-allowed" : ""}
        `}
        aria-checked={showDoneOnly}
        role="switch"
        aria-label={showDoneOnly ? "Show all courses" : "Filter only completed courses"}
    >
        <Filter className="w-5 h-5" aria-hidden="true" />
        {showDoneOnly ? "Show All" : `Filter Completed (${doneCount})`}
    </button>
);
