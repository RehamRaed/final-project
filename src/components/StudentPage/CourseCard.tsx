"use client";

import React from "react";

interface Course {
  course_id: string;
  title: string;
  summary: string;
  icon?: string;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-full">
      
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
      </div>
      
      <p className="text-gray-500 text-sm flex-1">{course.summary}</p>

      <div className="mt-4 flex justify-end">
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition">
          Start
        </button>
      </div>
    </div>
  );
}
