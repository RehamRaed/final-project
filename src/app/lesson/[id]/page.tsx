'use client'
import Header from "@/components/Header/Header";
import Lesson from "@/components/lesson/Lesson";
import { useParams } from "next/navigation";

export default function LessonPage (){
    const params = useParams();
    const pramId = Number(params.id);
    return(<>
        <div style={{zIndex: 50, position: "fixed", top: 0, left: 0, width:"100%"}} >
            <Header/>
        </div>
        <Lesson id={pramId}/>
    </>)
}