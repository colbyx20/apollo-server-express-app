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
        dateIndexs.push(i);
    }

    const dateObjects = Date.map((timestamp) => new Date(timestamp));

    return(
        <>
            <div className="showSchedulerContainer">
            {dateIndexs.map((item) => (
                
                <p key={item}>{}</p>
            ))}
            </div>
        </>
    )

}

export default DisplaySchedule;