import styles from "./Course.module.css"
import rigthArrow from "../../../public/rightArrow.svg"
import downArrow from "../../../public/downArrow.svg"
import { useState } from "react"
import Link from "next/link"
import TimeNeeded from "./TimeNeeded"
type lessonCardProps ={
    lesson:{
        id: number,
        title: string
        content: string,
        timeRequired:number,
        status: string,
    }
}
export default function LessonCard ({lesson}: lessonCardProps){
    const [isLessonOpened, setIsLessonOpened] = useState(false)
    function handleOnClick(){
        setIsLessonOpened(!isLessonOpened)
    }

    function handleStatus(){
        if(lesson.status == "Completed")
            return <h4 style={{color: "var(--color-accent)"}}>({lesson.status})</h4>
        else if(lesson.status == "In Progress")
            return <h4 style={{color: "var(--color-primary)"}}>({lesson.status})</h4>
        else
            return <h4 style={{color: "var(--color-text-secondary)"}}>({lesson.status})</h4>
    }
    return(<div className={styles.lessonCardContainer}>
        <div className={styles.lessonCardTitle}>
            <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
                <div style={{display:"flex", flexDirection:"row", gap:"5px"}}>
                    <h4> Course {lesson.title} </h4>
                    {handleStatus()}
                </div>
                <TimeNeeded minutes={lesson.timeRequired}/>
            </div>
            
            <img 
                className={styles.img} 
                onClick={handleOnClick}
                src={isLessonOpened? downArrow.src: rigthArrow.src}
            />
        </div>
        {isLessonOpened && <div style={{marginLeft:"20px", display:"flex", flexDirection:"column", gap:"10px"}}>
            <p>{lesson.content}</p>
            <Link style={{color:"var(--color-text-primary)", textDecoration:"underline"}} href={"/lesson"}>Contine Lesson</Link>
        </div>}
        
    </div>)
}