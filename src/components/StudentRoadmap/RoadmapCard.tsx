"use client";
interface Roadmap {
  id: string;
  title: string;
  description: string;
}

interface RoadmapCardProps {
  roadmap: Roadmap;
  isSelected: boolean;
  onSelect: () => void;
}

export default function RoadmapCard({ roadmap, isSelected, onSelect }: RoadmapCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer rounded-xl p-6 flex flex-col items-center justify-center
        border transition-colors duration-300 ease-in-out
        w-full
        ${isSelected ? "border-4 border-primary bg-primary/20" : "border border-gray-200 hover:shadow-lg hover:bg-gray-50"}
      `}
      style={{ minHeight: "180px" }}
    >
      <h3 className="text-lg font-bold text-center text-text-primary">{roadmap.title}</h3>
      <p className="text-sm text-center text-gray-600 mt-2">{roadmap.description}</p>
    </div>
  );
}
