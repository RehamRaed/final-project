import { Tables } from "./database.types";
import { Lesson } from "./lesson";

export type Course = Tables<'courses'>;

export interface CourseWithLessons extends Course {
  lessons?: Lesson[];
}

export interface CourseWithProgress extends Course {
  donePercentage?: number;
  status?: 'not_started' | 'in_progress' | 'completed';
}