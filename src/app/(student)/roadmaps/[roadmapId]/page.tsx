import { getRoadmapDetailsAction } from "@/actions/learning.actions";
import { Metadata } from 'next';
import { Tables } from "@/types/database.types";
import RoadmapDetailsClient from "@/components/Roadmap/RoadmapDetailsClient";

interface CourseWithProgress extends Tables<'courses'> {
  user_progress: { status: string | null }[] | null;
  lessons: { id: string; user_progress: { status: string | null }[] | null }[] | null;
}

interface RoadmapCourseDetails {
  order_index: number | null;
  course: CourseWithProgress | null;
}

interface DetailedRoadmap extends Tables<'roadmaps'> {
  roadmap_courses: RoadmapCourseDetails[] | null;
  progress_percent: number;
  xp: number;
}

interface RoadmapPageProps {
  params: Promise<{ roadmapId: string }>;
}

export async function generateMetadata({ params }: RoadmapPageProps): Promise<Metadata> {
  const { roadmapId } = await params;
  const result = await getRoadmapDetailsAction(roadmapId);

  if (!result.success || !result.data) {
    return {
      title: 'Roadmap Not Found',
      description: 'The requested roadmap could not be found.',
    };
  }

  const roadmap = result.data;

  return {
    title: `${roadmap.title} | StudyMate`,
    description: roadmap.description || `Follow the ${roadmap.title} on StudyMate.`,
    keywords: ['roadmap', 'study path', 'courses', roadmap.title],
    openGraph: {
      title: roadmap.title,
      description: roadmap.description || `Start your journey with ${roadmap.title}.`,
    }
  };
}

export default async function RoadmapCoursesPage({ params }: RoadmapPageProps) {
  const { roadmapId } = await params;

  const result = await getRoadmapDetailsAction(roadmapId);

  if (!result.success) {
    return (
      <main className="min-h-screen max-w-[1300px] mx-auto px-10 pt-30" role="alert">
        <h1 className="text-3xl font-bold text-red-600 mb-6">Loading Error</h1>
        <p className="text-lg text-gray-700">
          Sorry, we could not find the requested roadmap details or you do not have access.
        </p>
        <p className="text-sm mt-2 text-gray-500">
          {result.error}
        </p>
      </main>
    );
  }

  const roadmapData: DetailedRoadmap = result.data as DetailedRoadmap;

  const courses = (roadmapData.roadmap_courses || [])
    .filter(rc => rc.course)
    .map(rc => {
      const course = rc.course!;
      const lessons = course.lessons || [];
      const totalLessons = lessons.length;

      let donePercentage = 0;

      if (totalLessons > 0) {
        const completedLessons = lessons.filter(l =>
          l.user_progress?.[0]?.status === 'Completed' || l.user_progress?.[0]?.status === 'completed'
        ).length;
        donePercentage = Math.floor((completedLessons / totalLessons) * 100);
      } else {
        const status = course.user_progress?.[0]?.status;
        if (status === 'Completed' || status === 'completed') {
          donePercentage = 100;
        }
      }

      return {
        ...course,
        summary: course.description,
        order_index: rc.order_index,
        donePercentage: donePercentage,
      };
    });

  return (
    <RoadmapDetailsClient
      roadmapTitle={roadmapData.title}
      roadmapDescription={roadmapData.description}
      initialCourses={courses}
      progressPercent={roadmapData.progress_percent}
      userXp={roadmapData.xp}
    />
  );
}