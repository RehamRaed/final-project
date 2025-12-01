import styles from "./StudentRoadmap.module.css"

type progressBarProps ={
    donePersantage:number
}

export default function ProgressBar({donePersantage}:progressBarProps){
    return(<div className={styles.progressBarContainer}>
    <p>{donePersantage}% done</p>
    <div className={styles.progressBar}>
        <div style={{width:`${donePersantage}%`}} className={styles.progress}></div>
    </div>
</div>)}