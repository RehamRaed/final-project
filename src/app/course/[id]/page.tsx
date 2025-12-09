'use client'
import Course from "@/components/Course/Course";
import Header from "@/components/Header/Header";
import { useParams } from "next/navigation";

export default function CoursePage(){
    const params = useParams();
    const pramId = Number(params.id);
    return(<div style={{padding:"100px"}}>
        <Course id={pramId}/>
    </div>)
}