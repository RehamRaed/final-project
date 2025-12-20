"use client";

import React from 'react';
import { Tables } from "@/types/database.types";
import { Zap } from 'lucide-react';

interface RoadmapWithCount extends Tables<'roadmaps'> {
  course_count?: number;
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
    bg-card-bg hover:shadow-lg hover:border-gray-300 cursor-pointer
    ${isSelected ? "border-2 border-primary scale-[1.02]" : "border-gray-200 scale-100"}
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
      style={{ minHeight: "200px", position: "relative" }}
    >
      <div style={{ minHeight: "24px" }}>
        {isCurrentActive ? (
          <span className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
            Current
          </span>
        ) : isSelected && (
          <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
            Selected
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-text-primary mt-2" tabIndex={0}>
        {roadmap.title}
      </h3>

      <p className="text-sm text-text-secondary mt-2 line-clamp-2">
        {roadmap.description}
      </p>

      <div className="mt-4 text-xs font-medium text-text-secondary flex items-center gap-1">
        <Zap className="w-3 h-3" aria-hidden="true" />
        <span aria-label={`Number of courses: ${roadmap.course_count ?? 0}`}>
          {roadmap.course_count ?? 0} courses
        </span>
      </div>
    </button>
  );
}
