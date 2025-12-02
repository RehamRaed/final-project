'use client'
import Course from "@/components/Course/Course";
import Header from "@/components/Header/Header";
import { useParams } from "next/navigation";

export default function CoursePage(){
    const params = useParams();
    const pramId = Number(params.id);
    return(<div>
        <div style={{zIndex: 50, position: "fixed", top: 0, left: 0, width:"100%"}} >
            <Header/>
        </div>
        <Course id={pramId}/>
    </div>)
}