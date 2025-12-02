import Link from "next/link";
import styles from "./page.module.css"
import Title from "@/components/Title/title";
import CourseCard from "@/components/CourseCard/Card";
import Header from "@/components/Header/Header";

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
type studentHomePageProps ={
    studentName: string,
    selectedRoadmap: string,
    studentCourses: []
}
export default function StudentHomePage({studentName="Basma", selectedRoadmap}:studentHomePageProps){
    return(<div >
      <div style={{zIndex: 50, position: "fixed", top: 0, left: 0, width:"100%"}} >
        <Header/>
      </div>
        
        <div className={styles.studentHomePageContainer}>

        <h1 className={styles.title}>Welcome, {studentName}!</h1>
        <p className={styles.welcomeP}>
          Every step you take brings you closer to mastering your chosen roadmap✨
        </p>

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