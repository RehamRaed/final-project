"use client";

import { useRouter } from "next/navigation";
import Button from "../Button/Button";
interface Course {
  course_id: string;
  title: string;
  description: string;
  donePercentage: number;
}

interface Props {
  course: Course;
}

export default function RoadmapCourseCard({ course }: Props) {
  const router = useRouter();
  function handleContinue(){
    console.log("handle contiue clicked")
    router.push(`/courses/${course.course_id}`);
  }
  return (
    <div className="flex flex-col md:flex-row gap-4 rounded-xl shadow-md bg-white overflow-hidden hover:shadow-lg transition cursor-pointer">
      <div
        className="text-white p-6 flex flex-col justify-center rounded-l-xl md:w-1/4"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <p className="text-xs opacity-90">COURSE</p>
        <h3 className="text-lg font-bold mt-1">{course.title}</h3>
        <p className="text-sm mt-2 opacity-90">{course.description}</p>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs">CHAPTER 3</p>
          <div className="w-2/5">
            <ProgressBar donePercentage={course.donePercentage} />
          </div>
        </div>

        <h3 className="text-sm font-semibold mb-2">
          Working with Text Elements
        </h3>

        <div className="flex justify-end">
          <Button title="Continue" onClick={handleContinue}/>
        </div>
      </div>
    </div>
  );
}

const ProgressBar = ({ donePercentage }: { donePercentage: number }) => (
  <div className="flex flex-col gap-1">
    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
      <div
        className="h-3 bg-accent"
        style={{ width: `${donePercentage}%` }}
      ></div>
    </div>
    <p className="text-right text-gray-600 text-xs">
      {donePercentage}% done
    </p>
  </div>
);
