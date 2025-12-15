import { Lesson } from "./lesson";

export interface Course {
  course_id: string;
  title: string;
  description: string;
  summary: string;
  instructor: string;
  lessons?: Lesson[];
}