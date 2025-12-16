"use client";

import React from 'react';
import { Tables } from "@/types/database.types";
import { Map, Zap } from 'lucide-react';

interface RoadmapWithCount extends Tables<'roadmaps'> {
  course_count: number;
  // description is already in Tables<'roadmaps'>
}

interface RoadmapCardProps {
  roadmap: RoadmapWithCount;
  isSelected: boolean;
  isCurrentActive: boolean;
  onSelect: () => void;
}

export default function RoadmapCard({
  roadmap,
  isSelected,
  isCurrentActive,
  onSelect
}: RoadmapCardProps) {

  const cardClass = `
        p-6 border rounded-xl shadow-md transition-all duration-300 ease-in-out 
        w-full flex flex-col justify-between items-center text-center
        ${isSelected
      ? "border-4 border-blue-500 bg-blue-50 ring-4 ring-blue-100 scale-[1.02]"
      : "border-gray-200 hover:shadow-lg hover:border-gray-300 bg-white"
    }
    `;

  return (
    <button
      className={cardClass}
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={
        isCurrentActive
          ? `Current roadmap: ${roadmap.title}. Click to continue.`
          : `Roadmap: ${roadmap.title}. Click to select.`
      }
      style={{ minHeight: "180px" }}
    >
      {isCurrentActive ? (
        <span className="mb-2 px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full" aria-hidden="false">
          Current
        </span>
      ) : isSelected && (
        <span className="mb-2 px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full" aria-hidden="false">
          Selected
        </span>
      )}

      <div className={`text-4xl mb-3 ${isCurrentActive ? 'text-green-600' : 'text-blue-500'}`} aria-hidden="true">
        <Map className="w-8 h-8 mx-auto" />
      </div>

      <h3 className="text-lg font-bold text-gray-800" tabIndex={0}>
        {roadmap.title}
      </h3>

      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
        {roadmap.description}
      </p>

      <div className="mt-4 text-xs font-medium text-gray-500 flex items-center gap-1">
        <Zap className="w-3 h-3" aria-hidden="true" />
        <span aria-label={`Number of courses: ${roadmap.course_count}`}>{roadmap.course_count} courses</span>
      </div>
    </button>
  );
}
