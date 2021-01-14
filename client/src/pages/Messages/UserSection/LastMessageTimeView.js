import React,{useState,useEffect} from 'react'

function LastMessageTimeView({ timeOutputHandler,timeOutput}) {
    const [time,setTime] = useState(timeOutputHandler(timeOutput));
    
    

    useEffect(() => {
        let time = null;
       time = window.setInterval(() => {
        setTime(timeOutputHandler(timeOutput));
       })
       return () => clearInterval(time);
    },[timeOutput])
    
    return (
        <div>
            {time}
        </div>
    )
}

export default LastMessageTimeView
