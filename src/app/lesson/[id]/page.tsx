'use client'
import Header from "@/components/Header/Header";
import Lesson from "@/components/lesson/Lesson";
import { useParams } from "next/navigation";

export default function LessonPage (){
    const params = useParams();
    const pramId = Number(params.id);
    return(<>
        <Lesson id={pramId}/>
    </>)
}