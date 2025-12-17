'use client';

interface SelectedRoadmapCardProps {
  title: string;
  description?: string;
  icon?: string;
  color?: string;
}

export default function SelectedRoadmapCard({
  title,
  description,
  color = "var(--primary)",
}: SelectedRoadmapCardProps) {
  return (
    <div className="relative p-6 bg-card-bg border border-border rounded-2xl shadow-lg mx-auto">
      <div
        className="absolute left-[-1] top-0 h-full w-3 rounded-l-2xl"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
      </div>
      {description && <p className="text-text-secondary">{description}</p>}
    </div>
  );
}
