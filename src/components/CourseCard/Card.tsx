import styles from "./Card.module.css"

type cardProps ={
    course:{
        id: number,
        title: string,
        description: string
    }
}
export default function CourseCard({course}:cardProps){
    return(<div className={styles.cardContanier}>
        <h1 className={styles.title}>{course.title}</h1>
        <p className={styles.description}>{course.description}</p>
    </div>)
}