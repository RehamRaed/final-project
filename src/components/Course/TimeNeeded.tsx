import styles from "./Course.module.css"
export default function TimeNeeded ({minutes}:{minutes: number}){

    let finalTime = ""
    function caculateTime (){
        let hours = 0
        let minutesLeft = minutes;

        
        if (minutes < 60){
            finalTime = minutes + " minutes"
            return finalTime
        }

        while(minutesLeft > 60){
            minutesLeft -= 60;
            hours += 1; 
        }
        finalTime = hours + " hours " + minutesLeft + " minutes"
        return finalTime;
    }
    caculateTime()
    return(<div className={styles.time}>
        <p>{finalTime}</p>
    </div>

    )
}