import { useContext, useEffect } from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext';
import { useForm } from "../utility/hooks";
import { useMutation } from "@apollo/react-hooks";
import { gql } from 'graphql-tag';
import { TextField } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import CustomSidebar from '../components/Sidebar';
import { GetGroupMembers } from '../components/GetGroupMembers';
import { GetGroupAppointment } from '../components/GetGroupAppointment';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import "../components/css/student.css";


function Student(props) {

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
                        <div className='studentWrapper'>
                            <div className='userInfo'>
                                <p className='studentHeader'>Home Page</p>
                            </div>

                            <div className='studentGroupContainer'>
                                <div className='displayGroup'>
                                    <p className='notificationTitle'>Design Group</p>
                                    <div><GetGroupMembers SID={user.id} /></div>
                                </div>
                                <div className='displayNotification'>
                                    <p className='notificationTitle'>Design Meeting <NotificationsNoneIcon /></p>
                                    <div className='getAppContainer'><GetGroupAppointment SID={user.id} /></div>
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

export default Student