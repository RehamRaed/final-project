/*'use client';

import Course from "@/components/Course/";
import { useParams } from "next/navigation";
import React from "react";

export default function CoursePage() {
  const params = useParams();
  const id = params.id as string;

  if (!id || Number.isNaN(id)) {
    return <div className="p-8">Course id invalid</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Course id={id} />
    </div>
  );
}
*/