'use client';
import styles from "./page.module.css"
import Title from "@/components/Title/title";
import CourseCard from "@/components/CourseCard/Card";
import Header from "@/components/Header/Header";
import MiniToDoCard from "@/components/ToDos/MiniToDoCard";
import { ToDoItem } from "@/types/todo";


type StudentHomePageProps = {
  studentName?: string,
  selectedRoadmap?: string,
}

const mockTasks: ToDoItem[] = [
  { id: 1, task: "Complete Next.js Setup Module", status: 'In Progress' },
  { id: 2, task: "Read Tailwind CSS Documentation", status: 'In Progress' },
  { id: 3, task: "Watch Redux Toolkit Lecture", status: 'In Progress' },
  { id: 4, task: "Practice TypeScript Interfaces", status: 'Done' },
  { id: 5, task: "Design Database Schema", status: 'In Progress' },
];

const mockCourses = [
  {
    id: 1,
    title: "HTML & CSS Basics",
    description: "Learn the building blocks of the web.",
    icon: "🌐",
  },
  {
    id: 2,
    title: "JavaScript Fundamentals",
    description: "Understand the core of web programming.",
    icon: "⚡",
  },
  {
    id: 3,
    title: "React for Beginners",
    description: "Build interactive UIs using React.",
    icon: "⚛️",
  },
  {
    id: 4,
    title: "Node.js & Express",
    description: "Create backend servers and APIs.",
    icon: "🛠️",
  },
  {
    id: 5,
    title: "Node.js & Express",
    description: "Create backend servers and APIs.",
    icon: "🛠️",
  },
  {
    id: 6,
    title: "Node.js & Express",
    description: "Create backend servers and APIs.",
    icon: "🛠️",
  },
];



export default function StudentHomePage({
  studentName = "Basma",
  selectedRoadmap = "Full-Stack Developer Path"
}: StudentHomePageProps) {

  const hasRoadmap = !!selectedRoadmap;

  return (
    <div className="bg-bg min-h-screen pt-[90px]">

      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 p-6 bg-card-bg rounded-xl shadow-md border border-border space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
              Welcome, <span className="text-primary">{studentName}!</span>
            </h1>
            <p className="text-text-secondary text-lg font-medium">
              Every step you take brings you closer to mastering your roadmap ✨
            </p>

            <div className="mt-4 p-4 rounded-lg border-l-4 border-primary bg-primary/10">
              <p className="text-text-primary font-semibold">
                Current Roadmap: 
                <span className="ml-2 font-bold">{hasRoadmap ? selectedRoadmap : "No roadmap selected yet"}</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <MiniToDoCard tasks={mockTasks} />
          </div>

        </div>

        <Title title="My Courses:"/>
        <div className={styles.myCoursesContainer}>
            {mockCourses.map((course) => <CourseCard key={course.id} course={course}/>)}
        </div>
        
        <Title title="Suggested Courses:"/>
        <div className={styles.myCoursesContainer}>
            {mockCourses.map((course) => <CourseCard key={course.id} course={course}/>)}
        </div>
      </div>
    </div>)
}