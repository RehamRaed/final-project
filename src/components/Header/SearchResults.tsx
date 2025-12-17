'use client';

import Link from 'next/link';
import { CourseSearchResult } from "@/lib/search";

type SearchResultsProps = {
  res: CourseSearchResult[];
  onResultClick?: () => void; 
};

export default function SearchResults({ res, onResultClick }: SearchResultsProps) {
  return (
    <div className=" flex flex-col gap-3">
      {res.map((r) => (
        <Link
          key={r.id}
          href={`/courses/${r.id}/lessons`}
          className="text-text-primary no-underline hover:underline"
<<<<<<< HEAD
          onClick={onResultClick}
=======
          onClick={onResultClick} 
>>>>>>> 3514bc8 (feat: add logout confirmation modal and logic, refactor Header from MUI to Tailwind, chore: adjust project structure)
        >
          {r.title}
        </Link>
      ))}
    </div>
  );
}
