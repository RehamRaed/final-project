"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoadmapCard from "../../components/StudentRoadmap/RoadmapCard";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { setCurrentRoadmap } from "@/store/roadmapSlice";

interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export default function RoadmapsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const currentRoadmap = useSelector((state: RootState) => state.roadmap.current);

  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const resRoadmaps = await fetch("/api/roadmaps");
        const dataRoadmaps = await resRoadmaps.json();
        setRoadmaps(dataRoadmaps.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSelect = async (roadmap: Roadmap) => {
    if (currentRoadmap?.id === roadmap.id) return; // 🔹 ما نرسل شيء إذا نفس الكارت
    dispatch(setCurrentRoadmap(roadmap)); // تحديث Redux فورًا
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

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="p-10 max-w-[1400px] mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Roadmap</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {roadmaps.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            roadmap={roadmap}
            isSelected={currentRoadmap?.id === roadmap.id}
            onSelect={() => handleSelect(roadmap)}
          />
        ))}
      </div>

      {currentRoadmap && (
        <div className="mt-12 text-center">
          <Link
            href="/student"
            className="px-10 py-4 rounded-xl bg-primary text-lg font-semibold shadow-md hover:bg-primary-hover"
            style={{ color: "white" }}
          >
            Continue with {currentRoadmap.title}
          </Link>
        </div>
      )}
    </div>
  );
}