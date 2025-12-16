import Link from 'next/link';


interface Course {
    id: string;
    title: string;
    description: string;
    donePercentage: number;
}

type searchResultsProps = {
    res: Course[]
}

export default function SearchResults({ res }: searchResultsProps) {
    { console.log(res) }

    return (<>
        {res && <div className="flex flex-col gap-3">
            {res.map((r) =>
                <Link
                    key={r.id}
                    className="text-text-primary no-underline hover:underline"
                    href={`/courses/${r.id}/lessons`}
                >
                    {r.title}
                </Link>
            )}
        </div>}
    </>)
}