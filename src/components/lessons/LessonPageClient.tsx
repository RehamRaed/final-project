'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { toggleLessonCompletion } from '@/actions/learning.actions';
import LessonsSidebar from './LessonsSidebar';
import LessonDetails from './LessonDetails'; 
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";
import LoadingState from '@/components/ui/LoadingState';
import { Tables } from '@/types/database.types';
import { useNotifications } from '@/context/NotificationsContext';

type Lesson = Tables<'lessons'> & {
    user_progress: { status: string | null; completed_at: string | null }[] | null;
    duration_minutes?: number;
    video_url?: string | null;
};

type CourseData = Tables<'courses'> & {
    lessons: Lesson[] | null;
    lesson_progress_percent: number;
};

interface LessonPageClientProps {
    courseData: CourseData;
}

export default function LessonPageClient({ courseData }: LessonPageClientProps) {
    const { addNotification } = useNotifications();
    const router = useRouter();

    const lessons = useMemo(() => courseData.lessons || [], [courseData.lessons]);

    const [localLessons, setLocalLessons] = useState<Lesson[]>(lessons);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(localLessons[0] || null);
    const [isProcessing, setIsProcessing] = useState(false);

    const localProgressPercent = useMemo(() => {
        const total = localLessons.length || 0;
        if (total === 0) return 0;
        const completed = localLessons.filter(
            l => l.user_progress?.[0]?.status === 'Completed' || l.user_progress?.[0]?.status === 'completed'
        ).length;
        return Math.round((completed / total) * 100);
    }, [localLessons]);

    useEffect(() => {
        if (lessons.length > 0 && !selectedLesson) {
            setSelectedLesson(lessons[0]);
        }
        setLocalLessons(lessons);
    }, [lessons, selectedLesson]);

    const handleMarkDone = async (lessonId: string) => {
        setIsProcessing(true);
        const prevLessons = localLessons.map(l => ({ ...l, user_progress: l.user_progress ? [...l.user_progress] : l.user_progress }));
        try {
            const currentLesson = localLessons.find(l => l.id === lessonId);
            const isCurrentlyCompleted = currentLesson?.user_progress?.[0]?.status === 'Completed' || currentLesson?.user_progress?.[0]?.status === 'completed';
            const newStatus: 'InProgress' | 'Completed' = isCurrentlyCompleted ? 'InProgress' : 'Completed';

            const updated = localLessons.map(l => {
                if (l.id !== lessonId) return l;
                const newProgress = l.user_progress && l.user_progress.length > 0
                    ? [{ ...l.user_progress[0], status: newStatus, completed_at: newStatus === 'Completed' ? new Date().toISOString() : null }]
                    : [{ status: newStatus, completed_at: newStatus === 'Completed' ? new Date().toISOString() : null }];
                return { ...l, user_progress: newProgress };
            });

            setLocalLessons(updated);
            if (selectedLesson?.id === lessonId) {
                setSelectedLesson(updated.find(l => l.id === lessonId) ?? null);
            }

            const result = await toggleLessonCompletion(lessonId, courseData.id, newStatus);

            if (result?.success) {
                toast.success(result.message ?? 'Lesson updated');
                router.refresh();
                addNotification(`Lesson "${currentLesson?.title}" marked as ${newStatus === 'Completed' ? 'completed' : 'in progress'}.`);
            } else {
                setLocalLessons(prevLessons);
                setSelectedLesson(prevLessons.find(l => l.id === lessonId) ?? null);
                toast.error(result?.error ?? result?.message ?? 'Failed to update lesson progress');
            }
        } catch (error: unknown) {
            setLocalLessons(prevLessons);
            setSelectedLesson(prevLessons.find(l => l.id === lessonId) ?? null);
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            console.error('Error marking lesson done:', message);
            toast.error('An unexpected error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!courseData) return <LoadingState />;

    return (
        <div className='max-w-7xl mx-auto pt-25 px-5 pb-10'>
            <div className="mb-6 flex flex-col gap-2">
                <Link
                    href={`/courses/${courseData.id}`}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium w-fit transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Course</span>
                </Link>

                <div className="flex items-center gap-4 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 max-w-md">
                        <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${localProgressPercent}%` }}
                        ></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                        {localProgressPercent}% Completed
                    </span>
                </div>
            </div>

            <div className="flex gap-6 flex-col lg:flex-row h-[calc(100vh-200px)] min-h-150">
                <div className="lg:w-87.5 shrink-0 bg-bg rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-4 border-b ">
                        <h2 className="font-bold text-lg text-text-primary">Course Content</h2>
                        <p className="text-xs text-gray-500 mt-1">{localLessons.length} Lessons</p>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2">
                        <LessonsSidebar
                            lessons={localLessons}
                            selectedLessonId={selectedLesson?.id || null}
                            onSelectLesson={(lesson) => setSelectedLesson(lesson as Lesson)}
                            courseTitle={courseData.title}
                        />
                    </div>
                </div>

                <div className="flex-1 bg-bg rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    {selectedLesson ? (
                        <div className="h-full ">
                            {(() => {
                                const status =
                                    selectedLesson.user_progress?.[0]?.status === 'Completed' || selectedLesson.user_progress?.[0]?.status === 'completed'
                                        ? ('Completed' as const)
                                        : selectedLesson.user_progress?.[0]?.status === 'InProgress' || selectedLesson.user_progress?.[0]?.status === 'in_progress'
                                            ? ('InProgress' as const)
                                            : ('Not Started' as const);

                                const lessonProp = {
                                    ...selectedLesson,
                                    status,
                                    duration_minutes: selectedLesson.duration_minutes ?? 0,
                                    content: selectedLesson.content || '',
                                    video_url: selectedLesson.video_url ?? null
                                };

                                return (
                                    <LessonDetails
                                        lesson={lessonProp}
                                        onMarkDone={handleMarkDone}
                                        isMarkingDone={isProcessing}
                                    />
                                );
                            })()}
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
