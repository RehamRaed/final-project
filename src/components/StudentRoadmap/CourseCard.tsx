"use client";

import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import Button from "../Button/Button";


interface Props {
  course: {
    course_id: string;
    title: string;
    description: string;
    summary: string;
    instructor: string;
    donePercentage: number;
  };
}

export default function CourseCard({ course }: Props) {
  const router = useRouter();
  return (
    <div
      className="flex flex-col md:flex-row gap-4 rounded-xl shadow-md bg-white overflow-hidden hover:shadow-lg transition cursor-pointer"
      onClick={() =>
        router.push(`/courses/${course.course_id}/lessons`)
      }
    >
      <div className="text-white p-6 flex flex-col justify-center md:w-1/4 bg-primary rounded-l-xl">
        <p className="text-xs opacity-90">COURSE</p>
        <h3 className="text-lg font-bold mt-1">
          {course.title}
        </h3>
        <p className="text-sm mt-2 opacity-90">
          {course.summary}
        </p>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-500">
            INSTRUCTOR : {course.instructor}
          </p>
          <div className="w-2/5">
            <ProgressBar donePercentage={course.donePercentage} />
          </div>
        </div>

        <h3 className="text-[10px] mb-2">
          {course.description}
        </h3>

        <div className="flex justify-end">
          <Button
            title="Continue"
            onClick={() =>
              router.push(
                `/courses/${course.course_id}/lessons`
              )
            }
          />
        </div>
      </div>
    </div>
  );
}