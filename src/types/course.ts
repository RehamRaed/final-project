import { Tables } from "@/types/database.types";
import { BaseLesson } from "./lesson";

export type Course = Tables<'courses'>;

export interface CourseWithLessons extends Course {
  lessons?: BaseLesson[]; 
}

export interface CourseWithProgress extends Course {
  donePercentage?: number;
  status?: 'not_started' | 'in_progress' | 'completed';
}
