import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import CustomSidebar from '../components/Sidebar';
import { GetGroups } from '../components/GetGroups';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from "@mui/material";
import { gql, useQuery, useMutation } from '@apollo/client';
import '../components/css/professor.css';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { GetProfessorsAppointments } from '../components/GetProfessorsAppointments';


// import {GetAvailSchedule} from '../components/GetAvailSchedule';

const GET_NOTIFICATION_EMAIL = gql`
    mutation Mutation($id: String!, $email: String!, $privilege: String!) {
    sendEventEmail(ID: $id, email: $email, privilege: $privilege)
    }
`

function Professors(props) {

    // user data lives in here 
    const { user, logout } = useContext(AuthContext);
    let navigate = useNavigate();
    var year = new Date().getFullYear()
    const [sendEventEmail] = useMutation(GET_NOTIFICATION_EMAIL)
    const [emailInput, setEmailInput] = useState('');
    const onLogout = () => {
        logout();
        navigate('/');
    }

    function sendEmail() {

        sendEventEmail({
            variables: { id: user.id, email: emailInput.toLocaleLowerCase(), privilege: user.privilege }
        })
    }

    return (
        <>
            <div className='studentPage'>
                {user !== null ?
                    <>
                        <CustomSidebar />
                        <div className='professorWrapper'>
                            <div className="userInfo">
                                <p className='profHeader'>Home Page</p>
                            </div>

                            <div className='professorContainer'>
                                <div className='displayProfNotification'>
                                    <p className='notificationTitle'>Upcoming Meetings <NotificationsNoneIcon /></p>
                                    <div className='appointContainer'>
                                        <GetProfessorsAppointments />
                                    </div>
                                </div>
                            </div>

                            <div className='emailContainer'>
                                <p className='emailTitle'>Email Notifications</p>
                                <p className='emailClause'>Want to be emailed about upcoming appointments?</p>
                                <div className='emailSubmit'>
                                    <TextField size="small"
                                        sx={{ width: '50%', backgroundColor: 'white', borderRadius: '5px' }}
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                    />
                                    <br />
                                    <Button
                                        variant='contained'
                                        sx={{ marginTop: '5px', width: '50%' }}
                                        onClick={() => sendEmail()}
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