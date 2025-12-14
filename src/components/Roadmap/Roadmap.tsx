"use client";

import Link from "next/link";
import styles from "./Roadmap.module.css"
interface Roadmap {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

type RoadmapCardProps = {
  roadmap: Roadmap;
  onSelect: (id: string) => void;
  isSelected?: boolean;
};

export default function RoadmapCard({ roadmap, onSelect, isSelected = false}: RoadmapCardProps) {
    return (
        <div 
            className={`${styles.roadmapContainer} ${isSelected ? styles.selected : ""}`}
            onClick={() => onSelect(roadmap.id)}
        >
            
        {/* <div className={styles.icon}>
            {roadmap.icon}
        </div> */}

        <h2 className={styles.title}>{roadmap.title}</h2>
        <p className={styles.description}>{roadmap.description}</p>

        <div className={styles.linkContainer}>
            <Link
              href={`/roadmaps/${roadmap.id}`}
              className={styles.link}
            >
              Learn More
            </Link>
        </div>
        </div>
  );
}
