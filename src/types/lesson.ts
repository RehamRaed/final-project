export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  duration: number;
  content: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}