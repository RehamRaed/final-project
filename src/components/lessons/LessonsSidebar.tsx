import LessonCard from "./LessonCard";
import { Tables } from "@/types/database.types";

interface Props {
  lessons: Tables<'lessons'>[];
  selectedLessonId: string | null;
  onSelectLesson: (lesson: Tables<'lessons'>) => void;
  courseTitle: string;
  isPending?: boolean;
}

export default function LessonSidebar({
  lessons,
  selectedLessonId,
  onSelectLesson,
  courseTitle
}: Props) {
  return (
    <div className="w-full md:w-3/3  border rounded-xl  shadow-md p-4 max-h-[calc(105vh-160px)] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-primary">{courseTitle} Lessons</h2>

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
