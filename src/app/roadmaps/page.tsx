"use client";
import RoadmapCard from "@/components/Roadmap/Roadmap";
import styles from "./page.module.css"
import { useState } from "react";
import Link from "next/link";

const roadmaps = [
  { id: 1, title: "Frontend", description: "Learn HTML, CSS, JS, React", icon: "🌐" },
  { id: 2, title: "Backend", description: "Servers, APIs, Databases", icon: "🛠️" },
];

export default function RoadmapsPage() {
  const handleSelect = (id: number) => {
    setSelectedId(id)
    console.log("Selected roadmap:", id);
    const roadmap = roadmaps.find((roadmap) => roadmap.id === id);
    if (roadmap) {
      setSelectedTitle(roadmap.title);
    } else {
      setSelectedTitle(null);
    }

    console.log("Selected roadmap:", roadmap?.title);
  };
  const [selectedId, setSelectedId] = useState(-1);
  const [selectedTitle, setSelectedTitle] = useState<string | null> (null)
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Choose Your Roadmap</h1>

      <div className={styles.roadmapsContainer}>
        {roadmaps.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            roadmap={roadmap}
            onSelect={handleSelect}
            isSelected={roadmap.id === selectedId}
          />
        ))}
      </div>
      {selectedTitle != null && <Link href="/student" className={styles.link}>
        Continue with {selectedTitle}
      </Link>}
    </div>
  );
}