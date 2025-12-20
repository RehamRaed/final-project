"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoadmapCard from "@/components/StudentRoadmap/RoadmapCard";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { setCurrentRoadmap } from "@/store/roadmapSlice";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface RoadmapWithCount {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  created_at: string;
  course_count: number; 
}

export default function RoadmapsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const currentRoadmap = useSelector((state: RootState) => state.roadmap.current);

  const [roadmaps, setRoadmaps] = useState<RoadmapWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/roadmaps");
        const json = await res.json();

        const formattedRoadmaps: RoadmapWithCount[] = (json.data || []).map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description || "",
          icon: r.icon || "",
          color: r.color || "#000",
          is_active: r.is_active ?? true,
          created_at: r.created_at || new Date().toISOString(),
          course_count: r.course_count || 0,
        }));

        setRoadmaps(formattedRoadmaps);
      } catch (err) {
        console.error("Failed to load roadmaps", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSelect = async (roadmap: RoadmapWithCount) => {
    if (currentRoadmap?.id === roadmap.id) return;

    dispatch(setCurrentRoadmap(roadmap));

    try {
      await fetch("/api/profiles/update-roadmap", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId: roadmap.id }),
      });
    } catch (err) {
      console.error("Failed to save roadmap", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="pt-25 px-10 max-w-350 mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-12">
        Choose Your Roadmap
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {roadmaps.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            roadmap={roadmap}
            isSelected={currentRoadmap?.id === roadmap.id}
            isCurrentActive={currentRoadmap?.id === roadmap.id}
            onSelect={() => handleSelect(roadmap)}
          />
        ))}
      </div>

      {currentRoadmap && (
        <div className="mt-12 text-center">
          <Link
            href="/dashboard"
            className="px-3 py-2 md:px-10 md:py-4 rounded-xl bg-primary text-[14px] md:text-lg md:font-semibold shadow-md hover:bg-primary-hover"
            style={{ color: "white" }}
          >
            Continue with {currentRoadmap.title}
          </Link>
        </div>
      )}
    </div>
  );
}
