import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import CustomSidebar from '../components/Sidebar';
import dayjs from 'dayjs';
import { Button } from "@mui/material";
import { GetAllCoordinatorSchedule } from '../components/GetAllCoordinatorSchedule'
import "../components/css/calendar2.css"

function Calendar(props) {
    // user data lives in here  
    const { user, logout } = useContext(AuthContext);
    let navigate = useNavigate();
   
    var [currentDate, setCurrentDate] = useState(new Date());
    const initialValue = dayjs(currentDate);
  
    const onLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <>
            <div className='calendar2Page'>
                {user !== null ?
                    <>
                        <CustomSidebar />
                        <div className='calendar2Wrapper'>
                            <div className='userInfo'>
                                <p className='accountHeader'>Calendar</p>
                            </div>
                            <div className='leftContainer'>
                                <div className='timeListContainer'>
                                    <h2 className='timeListTitle'>Pick time</h2>
                                    <div className='listContainer'>
                                        <GetAllCoordinatorSchedule />
                                    </div>
                                </div>
                            </div>
                            <div className='rightContainer'>
                                <div className='timeListContainer'>

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