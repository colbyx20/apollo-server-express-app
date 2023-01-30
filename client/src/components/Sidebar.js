import './css/sidebar.css'
import {Link} from 'react-router-dom';
import {Box, Typography, Button} from '@mui/material';
import {AuthContext} from '../context/authContext'; 
import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import Home from '../components/images/house-door.svg';
import Gear from '../components/images/gear.svg';
import Building from '../components/images/building.svg';
import Calendar from '../components/images/calendar3-week.svg';
import Profile from '../components/images/person-circle.svg'

function Sidebar(){

    let navigate = useNavigate();

    const {user, logout} = useContext(AuthContext);

    const onLogout = () => {
        logout();
        navigate('/');
    }

    const firstname = localStorage.getItem("firstname");
    const lastname = localStorage.getItem("lastname");
    const privilege = localStorage.getItem("privilege");

    if(firstname === undefined){
        firstname = "";
    }

    if(lastname === undefined){
        lastname = "";
    }

    if(privilege === undefined){
        privilege = "";
    }

    function Formatter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
      

    return(
        <div className='sideBar'>
            <div className='currentUser'>
                <img src={Profile} alt="Profile Picture" className='currentPic'></img>
                <Typography varient='h5' component='div'>
                    <p>
                        {Formatter(firstname)} {Formatter(lastname)}<br/>
                        {Formatter(privilege)}
                    </p>
                </Typography>
            </div>
            <div className='options'>
                {privilege === 'student'?
                    <>
                        <div>
                            <Button
                            style={{textDecoration:"none", color: "white", width: "100%", left: "0"}}
                            sx={{borderRadius: '0'}}
                            ><img className='icon' src={Home} alt="Home"></img>Home</Button>

                            <Button
                            style={{textDecoration:"none", color: "white", width: "100%"}}
                            ><img className='icon' src={Calendar} alt="Calendar"></img>Schedule</Button>

                            <Button
                            style={{textDecoration:"none", color: "white", width: "100%"}}
                            ><img className='icon' src={Building} alt="Semester"></img>Semester</Button>                        
                            
                            <Button
                            style={{textDecoration:"none", color: "white", width: "100%", }}
                            ><img className='icon' src={Gear} alt="Settings"></img>Settings</Button>

                            <Button 
                            style={{textDecoration:"none", width: "100%", color:"white"}}
                            onClick={onLogout}>Logout</Button>
                        </div>
                        
                    </>
                    : privilege === 'professor'?
                    <>
                        <Button style={{textDecoration:"none", color:"white"}} onClick={onLogout}>Prof Logout</Button>
                    </>
                    :
                    <>
                        <Button style={{textDecoration:"none", color:"white"}} onClick={onLogout}>Prof Logout</Button>
                    </>
                }
            </div>
        </div>
    )
}

export default Sidebar;