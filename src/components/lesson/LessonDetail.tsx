interface Props {
  lesson: any;
  onMarkDone: (lessonId: string) => void;
}

export default function LessonDetail({ lesson, onMarkDone }: Props) {
  const borderColor =
    lesson.status === 'Completed'
      ? 'border-green-500'
      : lesson.status === 'In Progress'
      ? 'border-blue-500'
      : 'border-gray-300';

  return (
    <div className={`border-2 ${borderColor} p-12 bg-white rounded-xl flex flex-col gap-10`}>
      <h1 className="text-2xl font-bold text-primary">{lesson.title}</h1>
      <p className="text-gray-500">({lesson.duration} minutes)</p>
      <div className="prose max-w-none">{lesson.description}</div>
      <button
        className={`px-4 py-2 rounded-lg text-white font-semibold ${
          lesson.status === 'Completed'
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-green-500 hover:opacity-90'
        }`}
        disabled={lesson.status === 'Completed'}
        onClick={() => onMarkDone(lesson.id)}
      >
        {lesson.status === 'Completed' ? 'Completed' : 'Mark Done'}
      </button>
    </div>
  );
}
