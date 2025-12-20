import { getCourseLessonsAction } from "@/actions/learning.actions";
import { Metadata } from "next";
import CoursePageClient from "@/components/lessons/CoursePageClient";
import ErrorState from "@/components/ui/ErrorState";

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { courseId } = await params;
  const result = await getCourseLessonsAction(courseId);

  if (!result.success || !result.data) {
    return { title: "Course Not Found", description: "The requested course could not be found." };
  }

  const course = result.data as Tables<'courses'>;

  return {
    title: `${course.title} | StudyMate`,
    description: course.description || `Learn ${course.title} on StudyMate.`,
    keywords: [course.title, "learning", "education", ...(course.category_id ? [course.category_id] : [])],
    openGraph: {
      title: course.title,
      description: course.description || `Start learning ${course.title} today.`,
      images: course.thumbnail_url ? [course.thumbnail_url] : [],
    },
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;
  const result = await getCourseLessonsAction(courseId);

  if (!result.success) {
    return (
      <main className="min-h-screen max-w-325 mx-auto px-10 pt-30">
        <ErrorState
          title="Course Not Found"
          message="Sorry, we could not find the requested course or you do not have access."
          details={result.error ?? result.message}
        />
      </main>
    );
  }

  const courseData = result.data;

  if (!courseDataFromAPI) {
    return (
      <main className="min-h-screen max-w-325 mx-auto px-10 pt-30">
        <ErrorState title="No Data" message="Course data is not available." />
      </main>
    );
  }

  const lessons: LessonWithDuration[] =
    courseDataFromAPI.lessons?.map((lesson) => ({
      ...lesson,
      duration: typeof (lesson as any).duration === "number" ? (lesson as any).duration : 0,
      description: lesson.content ?? null,
      user_progress: lesson.user_progress ?? [],
    })) || [];

  const courseData: CourseDataWithLessons = {
    ...courseDataFromAPI,
    lessons,
    lesson_progress_percent: courseDataFromAPI.lesson_progress_percent ?? 0,
    current_roadmap_id: courseDataFromAPI.current_roadmap_id ?? null,
  };

  return (
    <CoursePageClient
      courseData={courseData}
      lessonProgressPercent={courseData.lesson_progress_percent}
      currentRoadmapId={courseData.current_roadmap_id}
    />
  );
}
