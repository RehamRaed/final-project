'use client';

import Link from 'next/link';
import { CourseSearchResult } from "@/lib/search";

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
<<<<<<< HEAD
          onClick={onResultClick}
=======
          onClick={onResultClick} 
>>>>>>> 322d7e96edf59d96ad265f1f0b9bcb46250f02d9
        >
          {r.title}
        </Link>
      ))}
    </div>
  );
}
