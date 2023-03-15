import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import CustomSidebar from '../components/Sidebar';
import { GetGroups } from '../components/GetGroups';
import { useNavigate } from 'react-router-dom'; import { Button } from "@mui/material";
import { gql, useQuery } from '@apollo/client';
import '../components/css/coordinator.css';
import { GetProfessorsAppointments } from '../components/GetProfessorsAppointments';


// import {GetAvailSchedule} from '../components/GetAvailSchedule';



function Professors(props) {

    // user data lives in here 
    const { user, logout } = useContext(AuthContext);
    let navigate = useNavigate();
    console.log(user);
    // let navigate = useNavigate();
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
                        <div className="userInfo">
                            <p style={{ textAlign: "left", margin: 0 }}>{user.email}</p>
                            <p style={{ textAlign: "left", margin: 0 }}>{user.firstname}</p>
                            <p style={{ textAlign: "left", margin: 0 }}>{user.lastname}</p>
                            <p style={{ textAlign: "left", margin: 0 }}>{year}</p>
                            <p></p>
                        </div>
                        <div><GetProfessorsAppointments /></div>
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