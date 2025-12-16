"use client";

import React from 'react';
import Link from 'next/link';
import { Tables } from "@/types/database.types";
import ProgressBar from "./ProgressBar";

interface CourseWithProgress extends Tables<'courses'> {
  summary: string | null;
  // instructor is already in Tables<'courses'>
  donePercentage: number;
}

interface CourseCardProps {
  course: CourseWithProgress;
  href: string;
}

export default function CourseCard({ course, href }: CourseCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col md:flex-row gap-0 rounded-xl shadow-lg bg-white overflow-hidden hover:shadow-xl transition duration-300"
      role="article"
      aria-label={`Go to course ${course.title}. Completion status: ${course.donePercentage} percent.`}
    >
      <div className="text-white p-6 flex flex-col justify-center md:w-1/4 bg-blue-600 rounded-l-xl transition-colors duration-300">
        <p className="text-xs opacity-90 uppercase tracking-wider font-medium">Course</p>
        <h3 className="text-lg font-bold mt-1" tabIndex={0}>
          {course.title}
        </h3>
        <p className="text-sm mt-2 opacity-90 line-clamp-2">
          {course.summary || 'No summary available.'}
        </p>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <p className="text-sm text-gray-700 font-medium">
            Instructor: <span className="font-semibold">{course.instructor || 'Not specified'}</span>
          </p>
          <div className="w-full sm:w-2/5" aria-label={`Progress bar: ${course.donePercentage}% completed`}>
            <ProgressBar donePercentage={course.donePercentage} />
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex justify-end">
          <span
            className={`
              px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-colors
              ${course.donePercentage === 100 ? 'bg-green-500' : 'bg-blue-600'}
            `}
          >
            {course.donePercentage === 100 ? "Completed ✓" : "Continue →"}
          </span>
        </div>
      </div>
    </Link>
  );
}
