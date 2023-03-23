import { useContext, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import CustomSidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { GetCoordinatorSchedule } from '../components/GetCoordinatorSchedule';
import '../components/css/coordinator.css';


function Coordinator(props) {

    // user data lives in here 
    const { user, logout } = useContext(AuthContext);
    let navigate = useNavigate();
    var year = new Date().getFullYear()
    const [registerProf, setRegisterProf] = useState("Add to Clipboard");
    const [registerCoord, setRegisterCoord] = useState("Add to Clipboard");


    const onLogout = () => {
        logout();
        navigate('/');
    }

    const onRegister = () => {
        navigator.clipboard.writeText("http://localhost:3000/register");
        setRegisterProf("Copied");
    }

    const onRegisterCoord = () => {
        navigator.clipboard.writeText("http://localhost:3000/registerCoordinator");
        setRegisterCoord("Copied");
    }

    return (
        <>
            <div className='coordPage'>
                {user !== null ?
                    <>
                        <CustomSidebar />
                        <div className='coordWrapper'>
                            <div className='userInfo'>
                                <p className='coordHeader'>Home Page</p>
                            </div>
                            <div className='coordContainer'>
                                <div className='leftLinkContainer'>
                                    <p className='linkTitle'><strong>Professor Register Link</strong></p>
                                    <Button
                                        sx={{
                                            marginLeft: '20%',
                                            marginBottom: '7px',
                                            width: '60%',
                                        }} variant="contained"
                                        endIcon={<ContentCopyIcon />}
                                        onClick={() => {
                                            onRegister()
                                        }}>{registerProf}</Button>

                                </div>
                                <div className='rightLinkContainer'>
                                    <p className='linkTitle'><strong>Coordinator Register Link</strong></p>
                                    <Button
                                        sx={{
                                            marginLeft: '20%',
                                            marginBottom: '7px',
                                            width: '60%',
                                        }} variant="contained"
                                        endIcon={<ContentCopyIcon />}
                                        onClick={() => {
                                            onRegisterCoord()
                                        }}>{registerCoord}</Button>

                                </div>
                            </div>
                            <div className='notificationContainer'>
                                <div className='notificationBox'>
                                    <p className='notificationTitle'>Upcoming Events<NotificationsNoneIcon /> </p>
                                    <div className='appointmentContainer'>
                                        <div ><GetCoordinatorSchedule /></div>
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

export default Coordinator