import { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import CustomSidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { GetCoordinatorSchedule } from '../components/GetCoordinatorSchedule';
import '../components/css/coordinator.css';

const GET_NOTIFICATION_EMAIL = gql`
    mutation Mutation($id: String!, $email: String!, $privilege: String!) {
    sendEventEmail(ID: $id, email: $email, privilege: $privilege)
    }
`

function Coordinator(props) {

    // user data lives in here 
    const { user, logout } = useContext(AuthContext);
    let navigate = useNavigate();
    var year = new Date().getFullYear()
    const [registerProf, setRegisterProf] = useState("Add to Clipboard");
    const [registerCoord, setRegisterCoord] = useState("Add to Clipboard");
    const [emailInput, setEmailInput] = useState('');

    const [sendEventEmail] = useMutation(GET_NOTIFICATION_EMAIL)

    const onLogout = () => {
        logout();
        navigate('/');
    }

    const onRegister = () => {
        navigator.clipboard.writeText("https://dolphin-app-djupw.ondigitalocean.app/register=a761aecca8680ee158790f64507fc67a4747a572f013055a130b9937c767a784");
        setRegisterProf("Copied");
    }

    const onRegisterCoord = () => {
        navigator.clipboard.writeText("https://dolphin-app-djupw.ondigitalocean.app/register=2281e84323a386094a2916cc2c32da0be14c8dba3e95a14e8d8b94e9b548d127");
        setRegisterCoord("Copied");
    }

    function sendEmail() {

        sendEventEmail({
            variables: { id: user.id, email: emailInput.toLocaleLowerCase(), privilege: user.privilege }
        })
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
                                        <GetCoordinatorSchedule ID={user.id} />
                                    </div>
                                </div>
                            </div>
                            <div className='emailContainer'>
                                <p className='emailTitle'>Email Notifications</p>
                                <p className='emailClause'>Want to be emailed about upcoming appointments?</p>
                                <div className='emailSubmit'>
                                    <TextField
                                        size="small"
                                        sx={{ width: '50%', backgroundColor: 'white', borderRadius: '5px' }}
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                    />
                                    <br />
                                    <Button
                                        variant='contained'
                                        sx={{ marginTop: '3px', width: '50%', height: '45%' }}
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

export default Coordinator