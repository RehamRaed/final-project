"use client";

import Link from "next/link";

interface Course {
  course_id: string;
  title: string;
  summary: string;
  icon?: string;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="p-4 bg-card-bg border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-full">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-lg font-semibold text-text-primary">
          {course.title}
        </h3>
      </div>
      <p className=" text-sm flex-1 text-text-secondary">{course.summary}</p>
      <div className="mt-4 flex justify-end">
        <Link
          href={`/courses/${course.course_id}`}
          className="text-primary hover:text-primary-hover transition"
        >
          learn more
        </Link>
      </div>
    </div>
  );
}
