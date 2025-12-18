"use client";

import { useState, useMemo } from "react";
import CourseCard from "@/components/StudentRoadmap/CourseCard";
import { Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Tables } from "@/types/database.types";

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
    userXp: number;
}

export default function RoadmapDetailsClient({
    roadmapTitle,
    roadmapDescription,
    initialCourses,
    progressPercent,
    userXp
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

 

    return (
        <div className="min-h-screen max-w-[1300px] mx-auto px-10 py-25 bg-bg text-text-primary">
          <header className="mb-8 border-b border-border pb-6 flex flex-col gap-4">
  <Link
    href="/dashboard"
    className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors"
  >
    <ArrowLeft className="w-5 h-5" />
    Back 
  </Link>

  <div className="flex flex-col gap-1">
    <h1 className="text-3xl md:text-4xl font-extrabold">{roadmapTitle}</h1>
    {roadmapDescription && (
      <p className="text-lg text-text-secondary">{roadmapDescription}</p>
    )}
  </div>

  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
    <div className="flex-1 w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-text-secondary">Overall Progress</span>
        <span className="text-sm font-bold text-primary">{progressPercent}%</span>
      </div>
      <div className="w-full bg-border rounded-full h-3 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>

    <div className="text-center px-4 py-2 bg-card-bg rounded-lg border border-border hrink-0">
      <p className="text-xs text-text-secondary font-medium">Completed</p>
      <p className="text-lg font-bold text-primary">{doneCount}/{initialCourses.length}</p>
    </div>
  </div>
</header>



            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 border-b border-border pb-4">
                    <h2 className="font-bold text-2xl text-text-primary" id="course-list-title">
                        Roadmap Courses
                        {showDoneOnly && (
                            <span className="text-lg text-accent ml-2">
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
                        <p className="text-center text-text-secondary text-lg py-10" aria-live="polite">
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
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold shadow-md
            ${showDoneOnly
                ? "bg-text-secondary hover:bg-text-primary"
                : "bg-primary hover:bg-primary-hover text-white"
            }
            ${!showDoneOnly && doneCount === 0 ? "opacity-60 cursor-not-allowed" : ""}
        `}
        aria-checked={showDoneOnly}
        role="switch"
        aria-label={showDoneOnly ? "Show all courses" : "Filter only completed courses"}
    >
        <Filter className="w-5 h-5" />
        {showDoneOnly ? "Show All" : `Filter Completed (${doneCount})`}
    </button>
);
