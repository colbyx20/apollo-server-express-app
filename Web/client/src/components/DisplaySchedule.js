import {  useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import Button from '@mui/material/Button';
import "../components/css/calendar2.css"
import { GetCoordinatorTimeRange } from '../components/GetCoordinatorTimeRange';


function DisplaySchedule(props){
    // user data lives in here  
    const { user, logout } = useContext(AuthContext);
    const [pickList, setPickList] = useState(props.pickList);
    const [timeList, setTimeList] = useState(props.timeList);
    const [dateList, setDateList] = useState(props.dateList);
    const timeRangeDataObj = GetCoordinatorTimeRange({ ID: user.id });
    let timeRangeData = useState([]);
    console.log(timeRangeDataObj);
    

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

        if(timeRangeDataObj.length > 0){
            for(let i = 0; i < timeRangeDataObj.length; i++){
                console.log(Date(timeRangeDataObj[i].time))
                timeRangeData.push(new Date(timeRangeDataObj[i].time));
            }
        }
    }, [props.pickList]);



    if(pickList.length === 0 && timeRangeData.length === 0)
        return <div>No items Schedule Selected.</div>;

    return(
        <>
            <div className="showSchedulerContainer">
            {/* {timeRange.map((item, index) => (
                <p key={index}>{item.time}</p>
            ))} */}
            </div>
        </>
    )

}

export default DisplaySchedule;