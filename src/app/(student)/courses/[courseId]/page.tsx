import { getCourseLessonsAction } from "@/actions/learning.actions";
import { Metadata } from 'next';
import { redirect } from "next/navigation";
import CoursePageClient from "@/components/Course/CoursePageClient";
import ErrorState from "@/components/ui/ErrorState";

interface CoursePageProps {
    params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
    const { courseId } = await params;
    const result = await getCourseLessonsAction(courseId);

    if (!result.success || !result.data) {
        return {
            title: 'Course Not Found',
            description: 'The requested course could not be found.',
        };
    }

    const course = result.data;

    return {
        title: `${course.title} | StudyMate`,
        description: course.description || `Learn ${course.title} on StudyMate.`,
        keywords: [course.title, 'learning', 'education', ...(course.category_id ? [course.category_id] : [])],
        openGraph: {
            title: course.title,
            description: course.description || `Start learning ${course.title} today.`,
            images: course.thumbnail_url ? [course.thumbnail_url] : [],
        }
    };
}

export default async function CoursePage({ params }: CoursePageProps) {
    const { courseId } = await params;

    const result = await getCourseLessonsAction(courseId);

    if (!result.success) {
        return (
            <main className="min-h-screen max-w-[1300px] mx-auto px-10 pt-30">
                <ErrorState
                    title="Course Not Found"
                    message="Sorry, we could not find the requested course or you do not have access."
                    details={result.error}
                />
            </main>
        );
    }

    const courseData = result.data;

    if (!courseData) {
        return (
            <main className="min-h-screen max-w-[1300px] mx-auto px-10 pt-30">
                <ErrorState
                    title="No Data"
                    message="Course data is not available."
                />
            </main>
        );
    }

    return (
        <CoursePageClient
            courseData={courseData}
            lessonProgressPercent={courseData.lesson_progress_percent}
        />
    );
}
