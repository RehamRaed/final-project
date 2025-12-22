import { Tables } from "@/types/database.types";

export interface LessonWithDuration extends Tables<"lessons"> {
  duration: number; 
  user_progress?: { status: string | null; completed_at: string | null }[] | null;
  description?: string | null;
}

export interface CourseDataWithLessons extends Tables<"courses"> {
  lessons: LessonWithDuration[];
  lesson_progress_percent: number;
  current_roadmap_id?: string;
}
