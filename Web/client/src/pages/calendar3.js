import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import CustomSidebar from '../components/Sidebar';
import dayjs from 'dayjs';
import { add } from 'date-fns';
import GlobalCalendar from '../components/GlobalCalendar';
import { Button} from "@mui/material";
import DisplayDesignWeek from '../components/DisplayDesignWeek';
import { GetCoordinatorTimeRange } from '../components/GetCoordinatorTimeRange';
import DisplaySchedule from '../components/DisplaySchedule';
import "../components/css/calendar2.css"

function Calendar(props) {
    // user data lives in here  
    const { user, logout } = useContext(AuthContext);
    let navigate = useNavigate();
    const requestAbortController = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [secondPickerEnabled, setSecondPickerEnabled] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [highlightedDays, setHighlightedDays] = useState([0]);
    var [currentDate, setCurrentDate] = useState(new Date());
    const initialValue = dayjs(currentDate);
    var [value, setValue] = useState(initialValue);
    var [endValue, setEndValue] = useState(null);
    const maxDate = add(new Date(), { months: 2 });
    const [selectedWeek, setSelectedWeek] = useState([]);
    const [getScheduleDate, setScheduleDate] = useState([]);
    const [getTimeRange, setTimeRange] = useState([]);
    const timeRangeData = GetCoordinatorTimeRange({ ID: user.id });
    
    if(timeRangeData[0]){
        currentDate = new Date(timeRangeData[0].time);
        value = new Date(timeRangeData[0].time);
    }
    

    const onLogout = () => {
        logout();
        navigate('/');
    }

    const handleListChange = (newList) => {
        setSelectedWeek(newList);
    };

    useEffect(() => {
        // abort request on unmount
        return () => requestAbortController.current?.abort();
    }, []);

    const handleMonthChange = (date) => {
        if (requestAbortController.current) {
            // make sure that you are aborting useless requests
            // because it is possible to switch between months pretty quickly
            requestAbortController.current.abort();
        }

        setIsLoading(true);
        setHighlightedDays([]);

    };


    const shouldDisableDate = (date) => {
        const day = dayjs(date).day();
        return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    };

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        // Perform form submission logic here
        getDaysBetweenDates(value, endValue);
        setIsSubmitted(true);
        setIsEmpty(true);
    }

    function getDaysBetweenDates(date1, date2) {
        const dayList = [];
        const currentDate = new Date(date1);
        currentDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date2);
        endDate.setHours(0, 0, 0, 0);

        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday (0) and Saturday (6)
                dayList.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }


        return dayList;
    }

    const addDateList = (item) => {
        setScheduleDate(item);
    };

    const addTimeList = (item) =>{
        setTimeRange(item);
    }

    let dateIndexs = [];

    // Create string from Date() obtained from api
    for(let i = 0; i< timeRangeData.length; i++){
        if(timeRangeData[i].time === undefined)
            continue;
        dateIndexs.push(timeRangeData[i].time);
    }

    const dateObjects = dateIndexs.map((timestamp) => new Date(timestamp));
    let tempRange = getDaysBetweenDates(dateObjects[0], dateObjects[dateObjects.length-1]);
    console.log(timeRangeData)
    
    return(
        <>
            <div className='calendar2Page'>
            {user !== null?
                <>
                    <CustomSidebar/>
                    <div className='calendar2Wrapper'>
                        <div className='userInfo'>
                            <p className='accountHeader'>Calendar</p>
                        </div>
                        <div className='leftContainer'>
                            <div className='calendar-container'>
                                    <h2 className='calendar-Title'>Calendar</h2>
                                    <GlobalCalendar
                                        daysList={selectedWeek}
                                        minDate={currentDate}
                                        maxDate={maxDate} />
                                </div>
                        </div>
                        <div className='rightContainer'>
                            <div className='selectTimes'>
                                <h2 className='timeTitle'>Create Schedule</h2>
                                <div className='timeContainer'>
                                <DisplayDesignWeek daysList={selectedWeek} isEmpty={isEmpty} 
                                onScheduleDate={addDateList} onTimeRange={addTimeList}/>
                                </div>
                                <h2 className='timeTitle'>View Schedule</h2>
                                <div className='viewSchedule'>
                                    <DisplaySchedule pickList={getScheduleDate} timeList={getTimeRange} 
                                    dateList={selectedWeek}/>
                                </div>
                            </div>
                        </div>
                    </div>
                                
                        
                </>
                :
                <>
                    <div className='noUser'>
                        <h3>No Page Found</h3>
                        <Button style={{ color: 'white' }} onClick={onLogout}>Redirect to Login</Button>
                    </div>
                </>
            }
            </div>
        </>
    )
}

export default Calendar;