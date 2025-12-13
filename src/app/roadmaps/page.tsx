"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoadmapCard from "../../components/Roadmap/Roadmap";

interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selected, setSelected] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const resRoadmaps = await fetch("/api/roadmaps");
        const dataRoadmaps = await resRoadmaps.json();
        setRoadmaps(dataRoadmaps.data || []);

        const resProfile = await fetch("/api/profiles/me");
        const profileJson = await resProfile.json();
        const currentRoadmapId = profileJson.data?.current_roadmap_id;
        if (currentRoadmapId) {
          const roadmap = (dataRoadmaps.data || []).find((r: any) => r.id === currentRoadmapId);
          if (roadmap) setSelected(roadmap);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSelect = async (roadmap: Roadmap) => {
    setSelected(roadmap);
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
            isSelected={selected?.id === roadmap.id}
            onSelect={() => handleSelect(roadmap)}
          />
        ))}
      </div>

      {selected && (
        <div className="mt-12 text-center">
          <Link
            href={{
              pathname: "/student",
              query: { id: selected.id, title: selected.title },
            }}
            className="px-10 py-4 rounded-xl bg-primary text-lg font-semibold shadow-md hover:bg-primary-hover" style={{color:"white"}}
          >
            Continue with {selected.title}
          </Link>
        </div>
      )}
    </div>
  );
}
