import { getCourseLessonsAction } from "@/actions/learning.actions";
import { Metadata } from 'next';
import LessonPageClient from "@/components/lessons/LessonPageClient";
import ErrorState from "@/components/ui/ErrorState";

interface LessonsPageProps {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: LessonsPageProps): Promise<Metadata> {
  const { courseId } = await params;
  return {
    title: `Lessons | Course ${courseId}`,
    description: `Start learning with our interactive lessons.`,
  };
}

export default async function LessonsPage({ params }: LessonsPageProps) {
  const { courseId } = await params;

  const result = await getCourseLessonsAction(courseId);

  if (!result.success) {
    return (
      <main className="min-h-screen max-w-1400px mx-auto px-5 pt-30">
        <ErrorState
          title="Course Not Found"
          message="Sorry, we could not load the lessons for this course."
          details={result.error}
        />
      </main>
    );
  }

  const courseData = result.data;

  if (!courseData) {
    return (
      <main className="min-h-screen max-w-1400px mx-auto px-5 pt-30">
        <ErrorState
          title="No Data"
          message="No course data available."
        />
      </main>
    );
  }

  return (
    <LessonPageClient courseData={courseData} />
  );
}