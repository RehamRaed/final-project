import TimeNeeded from "../Course/TimeNeeded";
import { Lesson } from '@/types/lesson';
import ReactMarkdown from 'react-markdown';

interface Props {
  lesson: Lesson;
  onMarkDone: (lessonId: string) => void;
}

function getYoutubeEmbedUrl(url?: string) {
  if (!url) return null;

  if (url.includes('youtube.com/embed')) return url;

  const watchMatch = url.match(/v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  return null;
}
export default function LessonDetail({ lesson, onMarkDone }: Props) {
  
  const borderColor =
    lesson.status === 'Completed'
      ? 'border-green-500'
      : lesson.status === 'In Progress'
      ? 'border-blue-500'
      : 'border-gray-300';

  const embedUrl = getYoutubeEmbedUrl(lesson.video_url);

  return (
    <div className={`border-2 ${borderColor} p-12 bg-white rounded-xl flex flex-col gap-5 max-h-[calc(105vh-160px)] overflow-y-auto`}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">{lesson.title}</h1>
        <button
          className={`px-4 py-2 rounded-lg text-white font-semibold ${
            lesson.status === 'Completed'
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:opacity-90'
          }`}
          disabled={lesson.status === 'Completed'}
          onClick={() => onMarkDone(lesson.id)}
        >
          {lesson.status === 'Completed' ? 'Completed' : 'Mark Done'}
        </button>
      </div>
      <p className="text-gray-500 flex flex-row">(<TimeNeeded minutes={lesson.duration}/>)</p>
      <div className="prose max-w-none">
        <ReactMarkdown
          components={{
            img: ({ node, ...props }) => (
              <img
                {...props}
                className="min-w-full h-auto rounded-lg my-4 hidden"
                style={{ maxHeight: '350px', objectFit: 'contain' }}
              />
            ),
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </div>
      {embedUrl && (
        <iframe
          className="w-full flex-1 rounded-lg min-h-[360px]"
          src={embedUrl}
          title={lesson.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
