import {useContext, useState} from 'react';
import { AuthContext } from '../context/authContext'; 
import CustomSidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import {Button} from "@mui/material";
import '../components/css/coordinator.css';

function Coordinator(props){

    // user data lives in here 
    const {user, logout} = useContext(AuthContext);
    let navigate = useNavigate();
    var year = new Date().getFullYear()


    const onLogout = () => {
        logout();
        navigate('/');
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