import { useState, useEffect } from "react";

export default function Clock({dateFormat}) {
    const [date, setDate] = useState(new Date());
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const day = days[date.getDay()];
    const dateString = dateFormat.replace("dd", date.getDate()).replace("mm",date.getMonth()+1).replace("yyyy",date.getFullYear())
    
    useEffect(()=>{
        const interval = setInterval(()=> setDate(new Date()),1000);
        return ()=>clearInterval(interval)
    },[])
    
    return(
            <h3 style={{color:"gray"}}>{dateString}, {day} {date.toLocaleTimeString()}</h3>
    )
}