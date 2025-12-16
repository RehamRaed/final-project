'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { toggleLessonCompletion } from '@/actions/learning.actions';
import LessonsSidebar from './LessonsSidebar';
import LessonDetails from './LessonDetails';
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";
import LoadingState from '@/components/ui/LoadingState';
import { Tables } from '@/types/database.types';

// تعريف الأنواع المطلوبة
type Lesson = Tables<'lessons'> & {
    user_progress: { status: string | null; completed_at: string | null }[] | null
};

type CourseData = Tables<'courses'> & {
    lessons: Lesson[] | null;
    lesson_progress_percent: number;
};

interface LessonPageClientProps {
    courseData: CourseData;
    lesson: Lesson;

}

export default function LessonPageClient({ courseData }: LessonPageClientProps) {
    const router = useRouter();
    const lessons = courseData.lessons || [];

    // إدارة الحالة المحلية
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lessons[0] || null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (lessons.length > 0 && !selectedLesson) {
            setSelectedLesson(lessons[0]);
        }
    }, [lessons, selectedLesson]);

    const handleMarkDone = async (lessonId: string) => {
        setIsProcessing(true);
        try {
            // التحقق من الحالة الحالية للدرس
            const currentLesson = lessons.find(l => l.id === lessonId);
            const isCurrentlyCompleted = currentLesson?.user_progress?.[0]?.status === 'completed';
            const newStatus = !isCurrentlyCompleted;

            const result = await toggleLessonCompletion(lessonId, courseData.id, newStatus);

            if (result.success) {
                toast.success(result.message);
                router.refresh(); // إعادة تحميل البيانات لتحديث الواجهة من الخادم

                // تحديث الحالة المحلية مؤقتاً حتى يتم التحديث من الخادم
                if (selectedLesson?.id === lessonId) {
                    // يمكن هنا تحديث الحالة المحلية إذا لزم الأمر، لكن router.refresh() سيقوم بذلك
                }
            } else {
                toast.error(result.error || 'Failed to update lesson progress');
            }
        } catch (error: any) {
            console.error('Error marking lesson done:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!courseData) {
        return <LoadingState />;
    }

    return (
        <div className='max-w-[1400px] mx-auto pt-25 px-5 pb-10'>
            <div className="mb-6 flex flex-col gap-2">
                <Link
                    href={`/courses/${courseData.id}`}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium w-fit transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Course: {courseData.title}</span>
                </Link>

                <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 max-w-md">
                        <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${courseData.lesson_progress_percent}%` }}
                        ></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                        {courseData.lesson_progress_percent}% Completed
                    </span>
                </div>
            </div>

            <div className="flex gap-6 flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[600px]">
                {/* Sidebar */}
                <div className="lg:w-[350px] flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-4 border-b bg-gray-50">
                        <h2 className="font-bold text-lg text-gray-800">Course Content</h2>
                        <p className="text-xs text-gray-500 mt-1">{lessons.length} Lessons</p>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2">
                        <LessonsSidebar
                            lessons={lessons as any} // تحويل النوع مؤقتاً ليتوافق مع المكون الحالي
                            selectedLessonId={selectedLesson?.id || null}
                            onSelectLesson={(lesson) => setSelectedLesson(lesson as any)}
                            courseTitle={courseData.title}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    {selectedLesson ? (
                        <div className="h-full ">
                            <LessonDetails
                                lesson={{
                                    ...selectedLesson,
                                    status: selectedLesson.user_progress?.[0]?.status === 'completed'
                                        ? 'Completed'
                                        : selectedLesson.user_progress?.[0]?.status === 'in_progress'
                                            ? 'InProgress'
                                            : 'Not Started',
                                    duration_minutes: selectedLesson.duration || 0, // Map duration to duration_minutes
                                    content: selectedLesson.content || '', // Ensure content is string
                                    video_url: selectedLesson.video_url || '' // Ensure video_url is string
                                } as any} // Using any temporarily to bypass strict type check on extended properties if needed, but the shape is now correct
                                onMarkDone={handleMarkDone}
                                isMarkingDone={isProcessing}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50/50">
                            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                <ArrowLeft className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-lg font-medium">Select a lesson to start learning</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
