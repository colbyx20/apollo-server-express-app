import {useContext, useState} from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom'; 
import CustomSidebar from '../components/Sidebar';
import {Button, Badge} from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import "../components/css/calendar2.css"

function Calendar(props){

    // user data lives in here 
    const {user, logout} = useContext(AuthContext);
    let navigate = useNavigate();


    const onLogout = () => {
        logout();
        navigate('/');
    }

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
                            <Badge></Badge>
                        </div>
                        <div className='rightContainer'>

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

export default Calendar;