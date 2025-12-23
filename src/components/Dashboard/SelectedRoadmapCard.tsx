'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { updateCurrentRoadmapAction } from '@/actions/learning.actions'; 

interface SelectedRoadmapCardProps {
  title?: string; 
  description?: React.ReactNode;
  color?: string;
  roadmapId?: string; 
  userId: string;
}

export default function SelectedRoadmapCard({
  title,
  description,
  color = "var(--primary)",
  roadmapId,
  userId,
}: SelectedRoadmapCardProps) {
  const router = useRouter();

  const handleSelectRoadmap = async () => {
    if (roadmapId) {
      const result = await updateCurrentRoadmapAction(roadmapId);
      if (result?.success) {
        router.refresh(); 
      } else {
        alert(result?.error || 'Failed to select roadmap');
      }
    } else {
      router.push("/roadmaps");
    }
  };

  return (
    <div className="relative p-6 bg-card-bg border border-border rounded-2xl shadow-lg mx-auto flex flex-col justify-between">
      <div
        className="absolute left-[-1] top-0 h-full w-3 rounded-l-2xl"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-text-primary">
          {title ?? "No Active Roadmap"}
        </h2>
      </div>

      {description && <div className="text-text-secondary mb-4">{description}</div>}

      {!title && (
        <button
          onClick={handleSelectRoadmap}
          className="cursor-pointer px-3 py-1 bg-primary text-white rounded-md text-sm font-semibold hover:opacity-90 transition self-start mt-auto"
        >
          Select a Roadmap
        </button>
      )}
    </div>
  );
}
