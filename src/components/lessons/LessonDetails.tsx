import TimeNeeded from "./TimeNeeded";
import { Tables } from '@/types/database.types';
import ReactMarkdown from 'react-markdown';
import { CheckCircle, Clock } from 'lucide-react';

interface Lesson extends Tables<'lessons'> {
  status: 'Completed' | 'InProgress' | 'Not Started';
  duration_minutes: number | null;
  content: string | null;
  video_url: string | null;
}
function getYoutubeEmbedUrl(url?: string | null) { // تم الإصلاح هنا (null | undefined)
  if (!url) return null;
  if (url.includes('youtube.com/embed')) return url;

  const watchMatch = url.match(/v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  return null;
}

interface Props {
  lesson: Lesson;
  onMarkDone: (lessonId: string) => void;
}
interface LessonDetailsProps {
  lesson: Lesson;
  onMarkDone: (lessonId: string) => void;
  isMarkingDone: boolean; // *تمت الإضافة لحل خطأ 2322 في LessonPageClient*
}

export default function LessonDetails({ lesson, onMarkDone, isMarkingDone }: LessonDetailsProps) {
  const borderColor =
    lesson.status === "Completed"
      ? "border-green-500"
      : lesson.status === "InProgress" // *تم الإصلاح هنا: In Progress إلى InProgress*
        ? "border-blue-500"
        : "border-gray-300";

  const embedUrl = getYoutubeEmbedUrl(lesson.video_url);

  return (
    <div className={`border-2 ${borderColor} p-5 md:p-12 rounded-xl flex flex-col gap-5 max-h-[calc(105vh-160px)] overflow-y-auto`}>
      <div className="flex flex-col md:flex-row items-start justify-between md:items-center gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-primary">{lesson.title}</h1>
        <button
          className={`px-4 py-2 rounded-lg text-white font-semibold ${lesson.status === 'Completed'
            ? 'bg-gray-500 cursor-not-allowed'
            : (isMarkingDone
              ? 'bg-blue-400 cursor-wait'
              : 'bg-green-500 hover:opacity-90')
            }`}
          disabled={lesson.status === 'Completed' || isMarkingDone}
          onClick={() => onMarkDone(lesson.id)}
        >
          {isMarkingDone ? 'Saving...' : lesson.status === 'Completed' ? 'Completed' : 'Mark Done'}
          {lesson.status !== 'Completed' && !isMarkingDone && <CheckCircle className="w-5 h-5 ml-1" />}
        </button>
      </div>

      <p className="text-gray-500 flex flex-row">
        <Clock className="w-4 h-4 mr-1" aria-hidden="true" />
        (<TimeNeeded minutes={lesson.duration_minutes} />) {/* *تم الإصلاح: lesson.duration إلى lesson.duration_minutes* */}
      </p>

      <div className="prose max-w-none">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </div>
      {embedUrl && (
        <iframe
          className="w-full flex-1 rounded-lg min-h-[360px]"
          src={embedUrl}
          title={lesson.title}
          frameBorder="0"
          allowFullScreen
        />
      )}

      {!embedUrl && lesson.video_url && (
        <a
          href={lesson.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium underline"
        >
          Open video in YouTube
        </a>
      )}
    </div>
  );
}
