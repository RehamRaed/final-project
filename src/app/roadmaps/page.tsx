"use client";
import RoadmapCard from "@/components/Roadmap/Roadmap";
import styles from "./page.module.css"
import { useState } from "react";
import { number } from "zod";
const mockRoadmaps = [
  { id: 1, title: "Frontend", description: "Learn HTML, CSS, JS, React", icon: "🌐" },
  { id: 2, title: "Backend", description: "Servers, APIs, Databases", icon: "🛠️" },
];

export default function RoadmapsPage() {
  const handleSelect = (id: number) => {
    setSelectedId(id)
    console.log("Selected roadmap:", id);
    
  };
    const [selectedId, setSelectedId] = useState(0);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Choose Your Roadmap</h1>

      <div className={styles.roadmapsContainer}>
        {mockRoadmaps.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            roadmap={roadmap}
            onSelect={handleSelect}
            isSelected={roadmap.id === selectedId}
          />
        ))}
      </div>
    </div>
  );
}