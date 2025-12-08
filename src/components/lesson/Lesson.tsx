import { ArrowLeft } from "lucide-react"
import TimeNeeded from "../Course/TimeNeeded"
import Title from "../Title/title"
import styles from "./Lesson.module.css"
import Link from "next/link"
import Button from "../Button/Button"
import { useState } from "react"

const lesson = {
        id: 1,
        course_id: 1,
        title: "Introduction to HTML",
        content:
          "HTML is the standard language used to build web pages. This lesson "+
          "\nexplains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements.HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements.HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements.HTML \n is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to HTML is the standard language used\n to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements. HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts  of tags and elements.HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements.",
        order: 1,
        created_at: "2025-01-01 10:00:00",
        updated_at: "2025-01-01 10:00:00",
        timeRequired: 70,
        status: "In Progress",
      }
        let borderColor = "";


export default function Lesson({id}:{id:number}){
    
    const [status, setStatus] = useState(lesson.status)
    function handleMarkDone(){
        checkBorderColor()
        setStatus("Completed")
        //more to send status to db
    }
    function checkBorderColor(){
        if (status == "Completed"){
            borderColor = "--color-accent"
        }else if (status == "In Progress"){
            borderColor = "--color-primary"
        }else{
            borderColor = "--color-border"
        }
    }
    
    checkBorderColor()
    return(<div className={styles.lessonContainer}>
        <Link
            className="flex items-center gap-1 font-semibold transition duration-150"
            style={{ color: 'var(--color-primary)' }}
            href={`/course/${lesson.course_id}`}
        >
            <ArrowLeft size={20} /> Back 
        </Link>
        <div style={{borderColor:`var(${borderColor})`}} className={styles.contentContainer}>
            <div className={styles.toppers}>
                <div>
                    <Title title={lesson.title}/>
                    <nav style={{display:"flex", alignItems:"center", color:"var(--color-text-secondary)"}}>(<TimeNeeded minutes={lesson.timeRequired}/>)</nav>
                </div>
                <Button title="Mark Done" bgcolor="--color-accent" onClick={handleMarkDone}/>
            </div>
            <article className={styles.content}>
                {lesson.content}
            </article>
        </div>
    </div>)
}