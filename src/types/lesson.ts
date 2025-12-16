import { Tables } from './database.types';

// Re-export database type for lessons
export type Lesson = Tables<'lessons'>;

// Extended lesson type with progress status
export interface LessonWithProgress extends Lesson {
  status?: 'Not Started' | 'In Progress' | 'Completed';
}