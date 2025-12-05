import { ArrowLeft } from "lucide-react"
import TimeNeeded from "../Course/TimeNeeded"
import Title from "../Title/title"
import styles from "./Lesson.module.css"
import Link from "next/link"

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
        status: "Completed",
      }

    let borderColor = "";
    if (lesson.status == "Completed"){
        borderColor = "var(--color-accent)"
    }else if (lesson.status == "In Progress"){
        borderColor = "var(--color-primary)"
    }else{
        borderColor = "var(--color-border)"
    }
export default function Lesson({id}:{id:number}){
    return(<div style={{borderColor:`${borderColor}`}} className={styles.lessonContainer}>
        <Link
        
        className="flex items-center gap-1 font-semibold transition duration-150"
        style={{ color: 'var(--color-primary)' }}
        href={`/course/${lesson.course_id}`}
        >
        <ArrowLeft size={20} /> Back 
      </Link>
        <div className={styles.contentContainer}>
            <div>
            <Title title={lesson.title}/>
            <nav style={{display:"flex", alignItems:"center", color:"var(--color-text-secondary)"}}>(<TimeNeeded minutes={lesson.timeRequired}/>)</nav>
        </div>
            <article className={styles.content}>
                {lesson.content}
            </article>
        </div>
    </div>)
}