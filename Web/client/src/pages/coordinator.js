import {useContext, useState} from 'react';
import { AuthContext } from '../context/authContext'; 
import CustomSidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import {Button} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import '../components/css/coordinator.css';

function Coordinator(props){

    // user data lives in here 
    const {user, logout} = useContext(AuthContext);
    let navigate = useNavigate();
    var year = new Date().getFullYear()
    const [registerProf, setRegisterProf] = useState("Add to Clipboard");
    const [registerCoord, setRegisterCoord] = useState("Add to Clipboard");

    const onLogout = () => {
        logout();
        navigate('/');
    }

    const onRegister =() => {
        setRegisterProf("Copied");
    }

    const onRegisterCoord =() => {
        setRegisterCoord("Copied");
    }

    return (
        <>
            <div className='coordPage'>
                {user !== null?
                    <>
                    <CustomSidebar/>
                    <div className='coordWrapper'>
                        <div className='userInfo'>
                            <p className='coordHeader'>Home Page</p>
                        </div>
                        <div className='coordContainer'>
                            <div className='linkContainer'>
                                <p className='linkTitle'><strong>Register Professor</strong></p>
                                <Button 
                                sx={{
                                    marginLeft: '20%',
                                    marginBottom: '7px',
                                    width: '55%',
                                }}variant="contained"
                                endIcon={<ContentCopyIcon />}
                                onClick={()=>{
                                    onRegister()
                                }}>{registerProf}</Button>
                                
                            </div>
                            <div className='linkContainer'>
                                <p className='linkTitle'><strong>Register Coordinator</strong></p>
                                <Button 
                                sx={{
                                    marginLeft: '20%',
                                    marginBottom: '7px',
                                    width: '55%',
                                }}variant="contained"
                                endIcon={<ContentCopyIcon />}
                                onClick={()=>{
                                    onRegisterCoord()
                                }}>{registerCoord}</Button>
                                
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

export default Coordinator