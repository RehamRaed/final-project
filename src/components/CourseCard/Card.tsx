'use client'
import { useRouter } from "next/navigation"
import styles from "./Card.module.css"

type cardProps ={
    course:{
        id: number,
        title: string,
        description: string
    }
}


export default function CourseCard({course}:cardProps){
    const router = useRouter();
    function handleRoadmapCardOnClick(){
    router.push(`/course/${course.id}`)

}
    return(<div 
        className={styles.cardContanier}
        onClick={handleRoadmapCardOnClick}>
        <h1 className={styles.title}>{course.title}</h1>
        <p className={styles.description}>{course.description}</p>
    </div>)
}