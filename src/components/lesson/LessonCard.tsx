import TimeNeeded from "../Course/TimeNeeded";

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    duration: number;
    status: 'Not Started' | 'In Progress' | 'Completed';
  };
  selected?: boolean;
  onClick: () => void;
}

export default function LessonCard({ lesson, selected = false, onClick }: LessonCardProps) {
  const statusColors: Record<string, string> = {
    'Completed': 'text-green-500',
    'In Progress': 'text-blue-500',
    'Not Started': 'text-gray-400',
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-3 rounded-lg border flex flex-col justify-between mb-2 transition-all ${
        selected
          ? 'border-2 border-primary bg-primary/10'
          : 'border border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm">{lesson.title}</h4>
        <span className={`text-xs ${statusColors[lesson.status]}`}>{lesson.status}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1"><TimeNeeded minutes={lesson.duration}/> </p>
    </div>
  );
}
