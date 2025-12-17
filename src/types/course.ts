import { Tables } from "./database.types";
import { Lesson } from "./lesson";

// استخدام النوع من database.types
export type Course = Tables<'courses'>;

// نوع موسع للكورس مع الدروس
export interface CourseWithLessons extends Course {
  lessons?: Lesson[];
}

// نوع للكورس مع معلومات التقدم
export interface CourseWithProgress extends Course {
  donePercentage?: number;
  status?: 'not_started' | 'in_progress' | 'completed';
}