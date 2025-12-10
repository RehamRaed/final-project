"use client";

type RoadmapCardProps = {
  roadmap: {
    id: string;
    title: string;
    description: string;
    icon?: string;
  };
  isSelected: boolean;
  onSelect: () => void;
};

export default function RoadmapCard({ roadmap, isSelected, onSelect }: RoadmapCardProps) {
  return (
    <div
      className={`border rounded-xl p-6 cursor-pointer shadow-md hover:shadow-lg transition ${
        isSelected ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"
      }`}
      onClick={onSelect}
    >
      <h2 className="text-xl font-semibold mb-2">{roadmap.title}</h2>
      <p className="text-gray-500">{roadmap.description}</p>
    </div>
  );
}
