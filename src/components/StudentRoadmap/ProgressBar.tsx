import styles from "./StudentRoadmap.module.css"

type progressBarProps ={
    donePersantage:number
}

export default function ProgressBar({donePersantage}:progressBarProps){
    return(<div className={styles.progressBarContainer}>
    <div className={styles.progressBar}>
        <div style={{width:`${donePersantage}%`}} className={styles.progress}></div>
    </div>
    <div style={{display:"flex", justifyContent:"flex-end"}}>
        <p style={{color:"var(--color-text-secondary)", fontSize:"var(--font-xs)"}}>{donePersantage}% done</p>
    </div>
    
</div>)}