import { Tables } from './database.types';

export type Lesson = Tables<'lessons'>;

export interface LessonWithProgress extends Lesson {
  status?: 'NotStarted' | 'InProgress' | 'Completed';
  duration_minutes?: number; 
}
