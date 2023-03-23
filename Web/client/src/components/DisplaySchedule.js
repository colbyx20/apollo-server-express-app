import { useState, useEffect } from "react";
import "../components/css/calendar2.css"


function DisplaySchedule(props){
    const [pickList, setPickList] = useState(props.pickList);
    const [timeList, setTimeList] = useState(props.timeList);
    const [dateList, setDateList] = useState(props.dateList);

    const staticTimeList = [
        "8:00am",
        "9:00am",
        "10:00am",
        "11:00am",
        "12:00pm",
        "1:00pm",
        "2:00pm",
        "3:00pm",
        "4:00pm",
        "5:00pm",
        "6:00pm",
        "7:00pm",
        "8:00pm",
    ]

    useEffect(() => {
        setPickList(props.pickList);
        setTimeList(props.timeList);
        setDateList(props.dateList);
    }, [props.pickList]);

    console.log(dateList);

    return(
        <div className="showSchedulerContainer">

        </div>
    )

}

export default DisplaySchedule;