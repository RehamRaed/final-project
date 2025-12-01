'use client'
import { useState } from "react";
import Button from "../Button/Button";
import Title from "../Title/title";
import RoadmapCard from "./RoadmapCard";
import styles from "./StudentRoadmap.module.css"

const courses = [
  {
    id: 1,
    title: "HTML Basics",
    description: "Learn the basics of HTML",
    status: "in progress",
    donePercentage: 30
  },
  {
    id: 2,
    title: "CSS Fundamentals",
    description: "Understand styling with CSS",
    status: "not started",
    donePercentage: 0
  },
  {
    id: 3,
    title: "JavaScript Essentials",
    description: "Learn core JavaScript concepts",
    status: "completed",
    donePercentage: 100
  },
  {
    id: 4,
    title: "React Basics",
    description: "Introduction to React library",
    status: "in progress",
    donePercentage: 45
  },
  {
    id: 5,
    title: "Node.js Introduction",
    description: "Learn backend with Node.js",
    status: "not started",
    donePercentage: 0
  }
];

type myRoadmapProps ={
}



export default function MyRoadmap(){
    const [done, setDone] = useState(false);
    const [myCourses, setMyCourses] = useState(courses);

    function handleDoneCourses(){
        setDone(!done)
        if(!done)
            setMyCourses(courses.filter((course)=> course.status == "completed"))
        else
        setMyCourses(courses)
    }
    
    {console.log(myCourses)}
    return(<div className={styles.roadmapContainer}>
        <div className={styles.headerContainer}>
            <Title title={done ? "My Roadmap / Done Courses" : "My Roadmap"} />
            <Button
                title={done ? "All Courses" : "Done Courses"}
                bgcolor="--color-accent"
                // toggle the done state on click
                onClick={handleDoneCourses}
            />
        </div>
        
        {myCourses.map((course) => <RoadmapCard key={course.id} course={course}/>)}
        
    </div>)
}