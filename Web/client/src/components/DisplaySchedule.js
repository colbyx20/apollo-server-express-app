import {  useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import Button from '@mui/material/Button';
import "../components/css/calendar2.css"
import dayjs from 'dayjs';
import { GetCoordinatorTimeRange } from '../components/GetCoordinatorTimeRange';
import { GetCoordinatorSchedule } from './GetCoordinatorSchedule';


function DisplaySchedule(props){
    // user data lives in here  
    const { user, logout } = useContext(AuthContext);
    const [pickList, setPickList] = useState(props.pickList);
    const [timeList, setTimeList] = useState(props.timeList);
    const [dateList, setDateList] = useState(props.dateList);
    const apiDates = GetCoordinatorTimeRange({ ID: user.id });
    

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


    // console.log(timeRangeDataObj)  
    if(pickList.length === 0 && apiDates.length === 0)
        return <div>No items Schedule Selected.</div>;
    
    let dateIndexs = [];

    // Create string from Date() obtained from api
    for(let i = 0; i< apiDates.length; i++){
        if(apiDates[i].time === undefined)
            continue;
        dateIndexs.push(apiDates[i].time);
    }

    //console.log(apiDates)
    const dateObjects = dateIndexs.map((timestamp) => new Date(timestamp))
    //console.log(dateObjects);

    return(
        <>
            <div className="showSchedulerContainer">
                <div className='stickyButton'>
                    <Button>Submit</Button>
                </div>
            {dateObjects.map((date, index) => (
            <p className='datesShown' key={date.getTime()+date.getFullYear()+date.getDate()}>
                {date.toLocaleDateString('en-US', { month: 'numeric'})+"/"+
                date.toLocaleDateString('en-us',{day: 'numeric'})+"/"+ date.toLocaleDateString('en-us',{year:'numeric'} )
                +" "+date.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: 'numeric', minute: 'numeric', hour12: true })}
            </p>
            ))}
            
            </div>
            
        </>
    )

}

export default DisplaySchedule;