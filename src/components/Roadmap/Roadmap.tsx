"use client";

import Link from "next/link";

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

export default function RoadmapCard({ roadmap, onSelect, isSelected = false }: RoadmapCardProps) {
  return (
    <div
      onClick={() => onSelect(roadmap.id)}
      className={`
        bg-primary shadow-lg p-5 w-72 h-72
        flex flex-col items-center justify-center gap-4
        rounded-full font-base text-bg
        transition-transform duration-300 ease-in-out
        hover:-translate-y-1
        ${isSelected ? "border-4 border-accent" : ""}
      `}
    >
      <h2 className="text-xl font-semibold">{roadmap.title}</h2>
      <p className="text-center">{roadmap.description}</p>

      <div>
        <Link
          href={`/roadmaps/${roadmap.id}`}
          className="underline text-bg"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
