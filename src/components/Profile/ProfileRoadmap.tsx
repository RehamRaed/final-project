// ProfileRoadmap.tsx
"use client";

import { useRouter } from "next/navigation";

interface ProfileRoadmapProps {
  currentRoadmapTitle: string; // تم التبسيط
}

export default function ProfileRoadmap({ currentRoadmapTitle }: ProfileRoadmapProps) {
  const router = useRouter();

  return (
    <div className="p-6 rounded-xl shadow-md border mt-6 bg-card-bg border-border">
      <h3 className="text-xl font-semibold mb-4 text-text-primary">
        Roadmap Details
      </h3>

      <div className="flex flex-col md:flex-row justify-between items-center p-4 rounded-lg bg-bg">
        <p className="mb-2 md:mb-0 text-text-secondary font-medium">
          Current Roadmap: {currentRoadmapTitle}
        </p>

        <button
          onClick={() => router.push("/roadmaps")}
          className="px-4 py-2 font-semibold rounded-lg transition text-sm bg-accent text-white hover:opacity-90"
        >
          Change Roadmap
        </button>
      </div>
    </div>
  );
}