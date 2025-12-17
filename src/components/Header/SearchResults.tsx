'use client';

import Link from 'next/link';

export interface CourseSearchResult {
  id: string;
  title: string;
  description: string;
}

type SearchResultsProps = {
  res: CourseSearchResult[];
  onResultClick?: () => void; 
};

export default function SearchResults({ res, onResultClick }: SearchResultsProps) {
  return (
    <div className="flex flex-col gap-3">
      {res.map((r) => (
        <Link
          key={r.id}
          href={`/courses/${r.id}/lessons`}
          className="text-text-primary no-underline hover:underline"
          onClick={onResultClick} 
        >
          {r.title}
        </Link>
      ))}
    </div>
  );
}
