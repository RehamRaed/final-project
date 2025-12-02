import { useRouter } from "next/navigation"
import ProgressBar from "./ProgressBar"
import styles from "./StudentRoadmap.module.css"

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
            <h3>{course.title}</h3>
            <p>{course.status}</p>
        </div>
        <p>{course.description}</p>
        <ProgressBar donePersantage={course.donePercentage}/>
    </div>)
}