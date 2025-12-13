"use client";

import { useSearchParams } from "next/navigation";
import SelectedRoadmapCard from "@/components/StudentRoadmap/SelectedRoadmapCard";
import CourseCard from "@/components/StudentPage/CourseCard";
import MiniToDoCard from "@/components/ToDos/MiniToDoCard";
import { ToDoItem } from "@/types/todo";

const mockTasks: ToDoItem[] = [
  { id: 1, task: "Complete Next.js Setup Module", status: 'In Progress' },
  { id: 2, task: "Read Tailwind CSS Documentation", status: 'In Progress' },
  { id: 3, task: "Watch Redux Toolkit Lecture", status: 'In Progress' },
  { id: 4, task: "Practice TypeScript Interfaces", status: 'Done' },
];

const mockCourses = [
  { id: 1, title: "HTML & CSS Basics", description: "Learn the building blocks of the web.", icon: "🌐" },
  { id: 2, title: "JavaScript Fundamentals", description: "Understand the core of web programming.", icon: "⚡" },
  { id: 3, title: "React for Beginners", description: "Build interactive UIs using React.", icon: "⚛️" },
  { id: 4, title: "Node.js & Express", description: "Create backend servers and APIs.", icon: "🛠️" },
  { id: 4, title: "Node.js & Express", description: "Create backend servers and APIs.", icon: "🛠️" },
  { id: 4, title: "Node.js & Express", description: "Create backend servers and APIs.", icon: "🛠️" },
];

export default function StudentHomePage() {
  const params = useSearchParams();
  const selectedTitle = params.get("title") || "No roadmap selected";
  const selectedIcon = params.get("icon") || "cloud";

  return (
    <div className="bg-bg min-h-screen pt-[90px]">
      <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-10">

        {/* Welcome + Selected Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 bg-card-bg rounded-xl shadow-md border border-border space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
              Welcome, <span className="text-primary">Student!</span>
            </h1>
            <p className="text-text-secondary text-sm font-medium">
              Every step you take brings you closer to mastering your roadmap ✨
            </p>

            <div className="mt-4">
              <SelectedRoadmapCard
                title={selectedTitle}
                description="This is your current roadmap. Keep progressing!"
                color="var(--primary)"
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <MiniToDoCard tasks={mockTasks} />
          </div>
        </div>

        {/* My Courses */}
        <h2 className="text-2xl font-bold text-primary">My Courses:</h2>
          <div className="overflow-x-auto scroll-smooth p-2 scrollbar-hide">
          <div className="flex gap-4 w-max">
            {mockCourses.map((course) => (
              <div key={course.id} className="flex-shrink-0 w-64 sm:w-72 lg:w-80">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
        {/* Suggested Courses */}
        <h2 className="text-2xl font-bold text-primary">Suggested Courses:</h2>
        <div className="overflow-x-auto scroll-smooth p-2 scrollbar-hide">
          <div className="flex gap-4 w-max">
            {mockCourses.map((course) => (
              <div key={course.id} className="flex-shrink-0 w-64 sm:w-72 lg:w-80">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
