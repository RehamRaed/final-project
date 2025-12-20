import LessonCard from "./LessonCard";
import { Tables } from "@/types/database.types";

interface Props {
  lessons: Tables<'lessons'>[];
  selectedLessonId: string | null;
  onSelectLesson: (lesson: Tables<'lessons'>) => void;
  // courseTitle is accepted for API compatibility but not used here
  courseTitle?: string;
  isPending?: boolean;
}

export default function LessonSidebar({
  lessons,
  selectedLessonId,
  onSelectLesson,
}: Props) {
  return (
    <div className="w-full md:w-3/3  border rounded-xl  shadow-md p-4 overflow-y-auto">

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