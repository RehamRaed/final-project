import LessonCard from "./LessonCard";

interface Props {
  lessons: any[];

  selectedLessonId: string | null;

  onSelectLesson: (lesson: any) => void;
}

export default function LessonSidebar({
  lessons,
  selectedLessonId,
  onSelectLesson,
}: Props) {
  return (
    <div className="w-1/3 border rounded-xl bg-white shadow-md p-4 max-h-[700px] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-primary">Lessons</h2>

      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          selected={selectedLessonId === lesson.id}
          onClick={() => onSelectLesson(lesson)}
        />
      ))}
    </div>
  );
}
