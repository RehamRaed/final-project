import Link from 'next/link';

interface Course {
  course_id: string;
  title: string;
  description: string;
  donePercentage: number;
}

type searchResultsProps={
    res: Course[]
}
export default function SearchResults({res}:searchResultsProps){
    {console.log(res)}
    return(<>
        {res && <div className="flex flex-col gap-3"> 
            {res.map((r)=>
            //edit href to the course id rout
                <Link className="text-text-primary no-underline hover:underline" key={r.course_id} href="/">
                    {r.title}
                </Link>
            )}
        </div>}
    </>)
}