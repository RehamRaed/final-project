"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { updateCurrentRoadmapAction } from "@/actions/learning.actions";

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
        alert(result?.error || "Failed to select roadmap");
      }
    } else {
      router.push("/roadmaps");
    }
  };

  const hasNoActiveRoadmap = !roadmapId || title === "No Active Roadmap";

  return (
    <div className="relative p-6 bg-card-bg border border-border rounded-2xl shadow-lg mx-auto flex flex-col justify-between min-h-40">
      <div
        className="absolute left-0 top-0 h-full w-2 rounded-l-2xl"
        style={{ backgroundColor: color }}
      />

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-text-primary">
          {title || "No Active Roadmap"}
        </h2>

        <div className="text-text-secondary text-sm">{description}</div>
      </div>

      {hasNoActiveRoadmap && (
        <button
          onClick={handleSelectRoadmap}
          className="mt-6 px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all duration-200 cursor-pointer self-start uppercase tracking-wide"
        >
          Select Your First Roadmap →
        </button>
      )}
    </div>
  );
}