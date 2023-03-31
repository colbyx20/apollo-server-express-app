import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import CustomSidebar from '../components/Sidebar';
import { GetGroups } from '../components/GetGroups';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from "@mui/material";
import { gql, useQuery } from '@apollo/client';
import '../components/css/professor.css';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import '../components/css/coordinator.css';
import { GetProfessorsAppointments } from '../components/GetProfessorsAppointments';


// import {GetAvailSchedule} from '../components/GetAvailSchedule';



function Professors(props) {

    // user data lives in here 
    const { user, logout } = useContext(AuthContext);
    let navigate = useNavigate();
    var year = new Date().getFullYear()

    const onLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <>
            <div className='studentPage'>
                {user !== null ?
                    <>
                        <CustomSidebar />
                        <div className='professorWrapper'>
                            <div className="userInfo">
                                <p className='studentHeader'>Home Page</p>
                            </div>

                            <div className='professorContainer'>
                                <div className='displayProfNotification'>
                                    <p className='notificationTitle'>Upcoming Meetings <NotificationsNoneIcon /></p>
                                    <div className='appointmentContainer'>
                                        <div className='appointmentObject'><GetProfessorsAppointments /></div>
                                    </div>
                                </div>
                            </div>

                            <div className='emailContainer'>
                                <p className='emailTitle'>Email Notifications</p>
                                <p className='emailClause'>Want to be emailed about upcoming appointments?</p>
                                <div className='emailSubmit'>
                                    <TextField size="small"
                                        sx={{ width: '50%', backgroundColor: 'white', borderRadius: '5px' }}></TextField>
                                    <br />
                                    <Button
                                        variant='contained'
                                        sx={{ marginTop: '5px', width: '50%' }}
                                    >Submit</Button>
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

export default Professors