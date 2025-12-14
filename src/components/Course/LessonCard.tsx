'use client';

import { useState } from "react";
import TimeNeeded from "./TimeNeeded";
import Link from "next/link";

type LessonProps = {
  lesson: {
    id: number;
    title: string;
    content: string;
    timeRequired: number;
    status: string;
  };
};

export default function LessonCard({ lesson }: LessonProps) {
  const [opened, setOpened] = useState(false);

  function statusColor() {
    if (lesson.status === "Completed") return "text-green-600";
    if (lesson.status === "In Progress") return "text-blue-600";
    return "text-gray-500";
  }

  function statusBarColor() {
    if (lesson.status === "Completed") return "bg-green-400";
    if (lesson.status === "In Progress") return "bg-blue-400";
    return "bg-gray-300";
  }

  return (
    <div className="flex gap-4">
      <div className={`w-1 rounded ${statusBarColor()}`} />
      <div className="flex-1 bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h4 className="font-semibold">{lesson.title}</h4>
              <span className={`${statusColor()} text-sm`}>({lesson.status})</span>
            </div>
            <TimeNeeded minutes={lesson.timeRequired} />
          </div>

          <button
            onClick={() => setOpened(!opened)}
            aria-expanded={opened}
            className="px-3 py-1 text-sm rounded hover:bg-gray-100"
          >
            {opened ? "Collapse" : "Open"}
          </button>
        </div>

        {opened && (
          <div className="mt-4 text-sm text-gray-700 space-y-3">
            <p>{lesson.content}</p>
            <Link href={`/lesson/${lesson.id}`} className="text-sm underline text-gray-800">
              Continue Lesson
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
