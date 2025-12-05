import Title from "../Title/title";
import styles from "./Course.module.css"
import LessonCard from "./LessonCard";
export default function Course({id}:{id:number}){
    {console.log(id)}
    const courses = [
  {
    id: 1,
    title: "HTML Basics",
    description: "Learn the basics of HTML",
    status: "in progress",
    donePercentage: 30,
    lessons: [
      {
        id: 1,
        course_id: 1,
        title: "Introduction to HTML",
        content:
          "HTML is the standard language used to build web pages. This lesson explains what HTML is, how it works, and the core concepts of tags and elements.",
        order: 1,
        created_at: "2025-01-01 10:00:00",
        updated_at: "2025-01-01 10:00:00",
        timeRequired: 70,
        status: "Completed",
      },
      {
        id: 2,
        course_id: 1,
        title: "HTML Document Structure",
        content:
          "Learn the structure of an HTML document including <!DOCTYPE html>, <html>, <head>, and <body>.",
        order: 2,
        created_at: "2025-01-01 10:10:00",
        updated_at: "2025-01-01 10:10:00",
        timeRequired: 10,
        status: "In Progress",
      },
      {
        id: 3,
        course_id: 1,
        title: "Working with Text Elements",
        content:
          "Covers headings, paragraphs, bold, italic text, and other essential formatting tags.",
        order: 3,
        created_at: "2025-01-01 10:20:00",
        updated_at: "2025-01-01 10:20:00",
        timeRequired: 40,
        status: "Not Started",
      },
      {
        id: 4,
        course_id: 1,
        title: "Links and Anchors",
        content:
          "Learn how to create links using the <a> tag and how to link inside the same page.",
        order: 4,
        created_at: "2025-01-01 10:30:00",
        updated_at: "2025-01-01 10:30:00",
        timeRequired: 90,
        status: "Not Started",
      },
      {
        id: 5,
        course_id: 1,
        title: "Working with Images",
        content:
          "Learn to embed images using <img>, understand src and alt attributes, and best accessibility practices.",
        order: 5,
        created_at: "2025-01-01 10:40:00",
        updated_at: "2025-01-01 10:40:00",
        timeRequired: 20,
        status: "Not Started",
      },
      {
        id: 6,
        course_id: 1,
        title: "Lists in HTML",
        content:
          "Covers ordered lists, unordered lists, and list item formatting.",
        order: 6,
        created_at: "2025-01-01 10:50:00",
        updated_at: "2025-01-01 10:50:00",
        timeRequired: 10,
        status: "Not Started",
      },
      {
        id: 7,
        course_id: 1,
        title: "Creating Tables",
        content:
          "Learn how to use <table>, <tr>, <td>, and <th> to structure tabular data.",
        order: 7,
        created_at: "2025-01-01 11:00:00",
        updated_at: "2025-01-01 11:00:00",
        timeRequired: 50,
        status: "Not Started",
      },
      {
        id: 8,
        course_id: 1,
        title: "HTML Forms Basics",
        content:
          "Covers form tags, inputs, labels, textareas, and submit buttons.",
        order: 8,
        created_at: "2025-01-01 11:10:00",
        updated_at: "2025-01-01 11:10:00",
        timeRequired: 70,
        status: "Not Started",
      },
      {
        id: 9,
        course_id: 1,
        title: "Semantic HTML",
        content:
          "Learn semantic tags like <section>, <article>, <header>, and <footer> for cleaner, accessible markup.",
        order: 9,
        created_at: "2025-01-01 11:20:00",
        updated_at: "2025-01-01 11:20:00",
        timeRequired: 700,
        status: "Not Started",
      },
      {
        id: 10,
        course_id: 1,
        title: "Project: Build Your First Webpage",
        content:
          "Use everything learned to build a simple webpage using headings, text, lists, images, and links.",
        order: 10,
        created_at: "2025-01-01 11:30:00",
        updated_at: "2025-01-01 11:30:00",
        timeRequired: 70,
        status: "Not Started",
      },
    ],
  },

  {
    id: 2,
    title: "CSS Fundamentals",
    description: "Understand styling with CSS",
    status: "not started",
    donePercentage: 0,
    lessons: [],
  },

  {
    id: 3,
    title: "JavaScript Essentials",
    description: "Learn core JavaScript concepts",
    status: "completed",
    donePercentage: 100,
    lessons: [],
  },

  {
    id: 4,
    title: "React Basics",
    description: "Introduction to React library",
    status: "in progress",
    donePercentage: 45,
    lessons: [],
  },

  {
    id: 5,
    title: "Node.js Introduction",
    description: "Learn backend with Node.js",
    status: "not started",
    donePercentage: 0,
    lessons: [],
  },
];


    const course = courses.find((course)=> course.id == id)
    console.log(course)
    
    if(!course){
      return(<p>An error occuered can't find course!</p>)
    }
    return(<div className={styles.courseLessonsContainer}>
    
    {course && <Title title={course?.title}/>}
    <div>
        {course?.lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}
    </div>
    </div>)
}