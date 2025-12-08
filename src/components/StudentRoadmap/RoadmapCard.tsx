import { useRouter } from "next/navigation"
import ProgressBar from "./ProgressBar"
import styles from "./StudentRoadmap.module.css"
import Button from "../Button/Button"

type roadmapCardProp ={
    course:{
        id: number,
        title: string,
        description: string,
        status: string,
        donePercentage: number
    }
}
export default function RoadmapCard({course}:roadmapCardProp){
    const router = useRouter();

    function handleRoadmapCardOnClick(){
        console.log("pressed")
        router.push(`/course/${course.id}`)
        
      }

    return(<div 
        className={styles.roadmapCardContainer} 
        onClick={handleRoadmapCardOnClick}>
        <div className={styles.titleContainer}>
            <p>COURSE</p>
            <h1>{course.title}</h1>
            <p className={styles.statusp}>{course.description}</p>
            {/* <p className={styles.statusp}>({course.status})</p> */}
        </div>
        <div className={styles.lessonDetails}>
            <div className={styles.lessonDetailsToppers}>
                <p>CHAPTER 3</p>
                <div style={{width:"40%"}}>
                    <ProgressBar donePersantage={course.donePercentage}/>
                </div>
            </div>
            <h1 className={styles.chapterTitle}>Working with Text Elements</h1>
            <div style={{display:"flex", justifyContent:"flex-end"}}>
                <Button title="Continue" bgcolor="--color-primary" onClick={handleRoadmapCardOnClick}/>
            </div>
        </div>
        
    </div>)
}