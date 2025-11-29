import Header from "@/components/Header/Header";
import Link from "next/link";
import styles from "./page.module.css"
import Title from "@/components/Title/title";

type studentHomePageProps ={
    studentName: string,
    selectedRoadmap: string
}
export default function StudentHomePage({studentName="Basma", selectedRoadmap}:studentHomePageProps){
    return(<div >
        <Header/>
        <div className={styles.studentHomePageContainer}>

        <h1 className={styles.title}>Welcome, {studentName}!</h1>
        <p className={styles.welcomeP}>
          Every step you take brings you closer to mastering your chosen roadmap✨
        </p>

        <Title title="My Courses:"/>
        <div className={styles.myCoursesContainer}>

        </div>
        
      </div>
    </div>)
}