"use client";

import React from "react";

interface Course {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="p-4 bg-card-bg border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center">
      <div className="w-full mb-3 flex justify-center">
        <span className="text-[5rem] w-full flex justify-center">{course.icon}</span>
      </div>

      <h3 className="text-lg font-semibold text-primary text-center mb-2">{course.title}</h3>

      <p className="text-text-secondary text-sm text-center">{course.description}</p>
    </div>

  );
}
