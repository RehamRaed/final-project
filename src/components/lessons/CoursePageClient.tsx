"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/database.types";
import { ArrowLeft, BookOpen, Clock, Award } from "lucide-react";
import Link from "next/link";

interface LessonWithProgress extends Tables<"lessons"> {
  user_progress:
    | { status: string | null; completed_at: string | null }[]
    | null;
}

interface CourseDataWithLessons extends Tables<"courses"> {
  lessons: LessonWithProgress[] | null;
}

interface CoursePageClientProps {
  courseData: CourseDataWithLessons;
  lessonProgressPercent: number;
  currentRoadmapId?: string;
}

export default function CoursePageClient({
  courseData,
  lessonProgressPercent,
}: CoursePageClientProps) {
  const router = useRouter();
  const lessons = useMemo(() => courseData.lessons || [], [courseData.lessons]);

  const completedLessons = useMemo(
    () => lessons.filter((l) => l.user_progress?.[0]?.status === "completed").length,
    [lessons]
  );

  const totalDuration = useMemo(
    () => lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0),
    [lessons]
  );

  const handleStartLearning = () => {
    router.push(`/courses/${courseData.id}/lessons`);
  };

  return (
    <div className="min-h-screen max-w-[1300px] mx-auto px-10 pt-30 pb-20">
      <header className="mb-8 border-b border-border pb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-primary mb-4 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <BookOpen className="w-12 h-12 text-white" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-3">
              {courseData.title}
            </h1>

            {courseData.description && (
              <p className="text-lg text-text-secondary mb-4">
                {courseData.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              {courseData.instructor && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Instructor:</span>
                  <span className="font-semibold">
                    {courseData.instructor}
                  </span>
                </div>
              )}

              {courseData.level && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Level:</span>
                  <span className="px-3 py-1 bg-blue-100 text-primary rounded-full font-semibold">
                    {courseData.level}
                  </span>
                </div>
              )}

              {totalDuration > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {Math.floor(totalDuration / 60)}h{" "}
                    {totalDuration % 60}m
                  </span>
                </div>
              )}

              {courseData.xp_reward && courseData.xp_reward > 0 && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <Award className="w-4 h-4" />
                  <span className="font-semibold">
                    {courseData.xp_reward} XP
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-secondary">
              Your Progress
            </span>
            <span className="text-sm font-bold text-primary">
              {lessonProgressPercent}%
            </span>
          </div>

          <div className="w-full bg-border rounded-full h-4 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${lessonProgressPercent}%` }}
            />
          </div>

          <p className="text-sm text-text-secondary mt-2">
            {completedLessons} of {lessons.length} lessons completed
          </p>
        </div>
      </header>

      {lessons.length === 0 ? (
        <p className="text-center text-text-secondary py-16">
          No lessons available for this course yet.
        </p>
      ) : (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleStartLearning}
            className="px-8 py-3 bg-primary cursor-pointer text-white text-lg font-bold rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            {lessonProgressPercent > 0
              ? "Continue Learning"
              : "Start Learning"}{" "}
            →
          </button>
        </div>
      )}
    </div>
  );
}
