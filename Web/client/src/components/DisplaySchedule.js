import { useContext, useState, useRef, useEffect, useCallback } from 'react';
import { gql, useMutation } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import Button from '@mui/material/Button';
import "../components/css/calendar2.css"
import SaveIcon from '@mui/icons-material/Save';
import { GetCoordinatorTimeRange } from '../components/GetCoordinatorTimeRange';

const SEND_SCHEDULE = gql`
    mutation Mutation($coordinatorSInput: coordinatorSInput) {
        createCoordinatorSchedule(coordinatorSInput: $coordinatorSInput)
    }
`


function DisplaySchedule(props) {
    // user data lives in here  
    const { user } = useContext(AuthContext);
    const [pickList, setPickList] = useState(props.pickList);
    const [timeList, setTimeList] = useState(props.timeList);
    const [dateList, setDateList] = useState(props.dateList);
    const [dateO, setDateO] = useState([])
    const apiDates = GetCoordinatorTimeRange({ ID: user.id });
    const [createCoordinatorSchedule] = useMutation(SEND_SCHEDULE)

    //console.log(props);

    const staticTimeList = [
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
    ]

    useEffect(() => {
        setPickList(props.pickList);
        setTimeList(props.timeList);
        setDateList(props.dateList);

    }, [props.pickList, props.timeList, props.dateList]);

    // console.log('datelist');
    // console.log(timeList)

    // console.log(timeRangeDataObj)  
    if (pickList.length === 0 && apiDates.length === 0)
        return <div>No items Schedule Selected.</div>;

    let dateIndexs = [];

    // Create string from Date() obtained from api
    for (let i = 0; i < apiDates.length; i++) {
        if (apiDates[i].time === undefined)
            continue;
        dateIndexs.push(apiDates[i].time);
    }

    // Prevent duplicate times 
    const searchDates = (currDate) => {
        for(let i = 0; i < dateObjects.length; i ++){
            if(dateObjects[i].toISOString() === currDate.toISOString())
                return false;
        }

        return true;
    }

    
    const dateObjects = dateIndexs.map((timestamp) => new Date(timestamp))
    console.log(dateObjects);

    // Add new dates and time to list
    if (pickList.length > 0 && timeList.length > 0) {
        // Iterate thorough each date
        for (let picklen = 0; picklen < pickList.length; picklen++) {
            // Iterate through each time 
            for(let timelen = 0; timelen < timeList.length; timelen++){
                
                const myDate = new Date(dateList[pickList[picklen]]);
                myDate.setHours(staticTimeList[timeList[timelen]], 0, 0, 0);
                console.log(dateList[picklen])
                console.log(pickList)
                if (searchDates(myDate))
                    dateObjects.push(myDate);
            }
        }
    }

            
    
    function handlePickedDates(){   

        createCoordinatorSchedule({
            variables:{ coordinatorSInput:{
                CID: user.id,
                Room: 'HEC-101',
                Times: dateObjects
            }}
        })
    }

    return (
        <>
            <div className="showSchedulerContainer">
                <div className='stickyButton'>
                    <Button
                        onClick={handlePickedDates}
                    ><SaveIcon /></Button>
                </div>
                {dateObjects.map((date, index) => (
                    <p className='datesShown' key={date.getTime() + date.getFullYear() + date.getDate()}>
                        {date.toLocaleDateString('en-US', { month: 'numeric' }) + "/" +
                            date.toLocaleDateString('en-us', { day: 'numeric' }) + "/" + date.toLocaleDateString('en-us', { year: 'numeric' })
                            + " " + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                    </p>
                ))}

            </div>

        </>
    )

}

export default DisplaySchedule;