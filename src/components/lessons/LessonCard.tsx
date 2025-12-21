import TimeNeeded from "./TimeNeeded";
import { Tables } from '@/types/database.types';

interface LessonCardProps {
  lesson: Tables<'lessons'> & { user_progress?: { status?: string | null; completed_at?: string | null }[] | null; status?: string };
  selected?: boolean;
  onClick: () => void;
}

export default function LessonCard({
  lesson,
  selected = false,
  onClick,
}: LessonCardProps) {
  const statusColors: Record<string, string> = {
    Completed: "text-green-500",
    InProgress: "text-blue-500",
    "Not Started": "text-gray-400",
  };

  // Normalize status: prefer explicit `lesson.status`, otherwise derive from `user_progress`
  const rawStatus = lesson.status ?? lesson.user_progress?.[0]?.status ?? null;
  const lessonStatus = rawStatus === 'Completed' || rawStatus === 'completed'
    ? 'Completed'
    : rawStatus === 'InProgress' || rawStatus === 'in_progress'
    ? 'InProgress'
    : 'Not Started';

  const duration = (lesson as { duration_minutes?: number; duration?: number }).duration_minutes ?? (lesson as { duration_minutes?: number; duration?: number }).duration ?? 0;

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-3 rounded-lg border flex flex-col justify-between mb-2 transition-all ${selected
        ? "border-2 border-primary bg-primary/10"
        : "border border-gray-200 hover:shadow-md"
        }`}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm">{lesson.title}</h4>

        <span className={`text-xs ${statusColors[lessonStatus]}`}>
          {lessonStatus}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        <TimeNeeded minutes={duration} />
      </p>
    </div>
  );
}
