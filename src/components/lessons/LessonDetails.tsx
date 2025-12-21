import TimeNeeded from "./TimeNeeded";
import ReactMarkdown from "react-markdown";
import { CheckCircle, Clock } from "lucide-react";
import { LessonWithProgress } from "@/types/lesson";

function getYoutubeEmbedUrl(url?: string | null) {
  if (!url) return null;

  if (url.includes("youtube.com/embed")) return url;

  const watchMatch = url.match(/v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  return null;
}

interface LessonDetailsProps {
  lesson: LessonWithProgress;
  onMarkDone: (lessonId: string) => void;
  isMarkingDone: boolean;
}

export default function LessonDetails({
  lesson,
  onMarkDone,
  isMarkingDone,
}: LessonDetailsProps) {
  const lessonStatus = lesson.status ?? "Not Started";
  const duration = lesson.duration_minutes ?? 0;

  const borderColor =
    lessonStatus === "Completed"
      ? "border-green-500"
      : lessonStatus === "InProgress"
      ? "border-blue-500"
      : "border-gray-300";

  const embedUrl = getYoutubeEmbedUrl(lesson.video_url);

  return (
    <div className={` p-5 md:p-12 rounded-xl flex flex-col gap-5 max-h-[80vh] overflow-y-auto`}>
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          {lesson.title}
        </h1>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold ${
            lessonStatus === "Completed"
              ? "bg-gray-500 cursor-not-allowed"
              : isMarkingDone
              ? "bg-blue-400 cursor-wait"
              : "bg-green-500 hover:opacity-90"
          }`}
          disabled={lessonStatus === "Completed" || isMarkingDone}
          onClick={() => onMarkDone(lesson.id)}
        >
          {lessonStatus !== "Completed" && !isMarkingDone && (
            <CheckCircle className="w-5 h-5" />
          )}
          {isMarkingDone ? "Saving..." : lessonStatus === "Completed" ? "Completed" : "Mark Done"}
        </button>
      </div>

      <div className="flex items-center gap-2 text-text-secondary">
        <Clock className="w-4 h-4" />
        <TimeNeeded minutes={duration} />
      </div>

      {lesson.content && (
        <div className="prose max-w-none">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>
      )}

      {embedUrl && (
        <iframe
          className="w-full min-h-75 rounded-lg"
          src={embedUrl}
          title={lesson.title}
          allowFullScreen
        />
      )}

      {!embedUrl && lesson.video_url && (
        <a
          href={lesson.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          Open video in YouTube
        </a>
      )}
    </div>
  );
}
