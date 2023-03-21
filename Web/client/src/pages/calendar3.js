import {useContext, useState, useRef, useEffect} from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate} from 'react-router-dom'; 
import CustomSidebar from '../components/Sidebar';
import dayjs from 'dayjs';
import { add } from 'date-fns';
import TimeSelectDisplay from '../components/TimeSelectDisplay';
import GlobalCalendar from '../components/GlobalCalendar';
import {Button, Badge, TextField, Typography} from "@mui/material";
import HourSelectDisplay from '../components/HourSelectDisplay';


function ProfessorCalendar(props){
    // user data lives in here  
    const {user, logout} = useContext(AuthContext);
    let navigate = useNavigate();
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const initialValue = dayjs(currentDate);
    const [value, setValue] = useState(initialValue);
    const maxDate = add(new Date(), { months: 2 });
    const [selectedDate, setSelectedDate] = useState([]);
    const [selectedTime, setSelectedTime] = useState([]);

    const onLogout = () => {
        logout();
        navigate('/');
    }

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };
    
      const handleTimeChange = (newHour) => {
        setSelectedTime(newHour);
    };

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
                            minDate = {value}
                            maxDate = {maxDate}/>
                        </div>
                    </div>
                    <div className='rightContainer'>
                        <div className='selectTimes'>
                            <h2 className='timeTitle'>Create Schedule</h2>
                            <div className='timeContainer'>
                                <TimeSelectDisplay onDateChange={handleDateChange}/>
                                <HourSelectDisplay onTimeChange={handleTimeChange}/>
                                <Button variant="contained" color="primary" type="submit"
                            style={{ width: "50%", margin: "auto", marginTop: '4px', display: "flex", alignItems: "center" }}
                            >Submit</Button>
                            </div>
                            <br/>
                            <h2 className='timeTitle'>View Schedule</h2>
                            <div className='viewSchedule'>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </>
            : 
            <>
                <div className='noUser'>
                    <h3>No Page Found</h3>
                    <Button style={{color:'white'}}onClick={onLogout}>Redirect to Login</Button>
                </div>
            </>
        }
    </div>
    </>
   )
}

export default ProfessorCalendar;