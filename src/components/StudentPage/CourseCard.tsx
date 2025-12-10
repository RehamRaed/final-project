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
    <div className="p-4 bg-card-bg border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{course.icon}</span>
        <h3 className="text-lg font-semibold text-primary">{course.title}</h3>
      </div>
      <p className="text-text-secondary text-sm">{course.description}</p>
    </div>
  );
}
