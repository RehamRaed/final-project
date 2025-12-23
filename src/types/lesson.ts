import { Tables } from "@/types/database.types";

export type BaseLesson = Tables<'lessons'>;

export interface LessonWithProgress extends BaseLesson {
  status?: 'Completed' | 'InProgress' | 'Not Started';
  duration_minutes?: number | null;
  video_url?: string | null;

  user_progress?: {
    status: string | null;
    completed_at: string | null;
  }[] | null;
}
