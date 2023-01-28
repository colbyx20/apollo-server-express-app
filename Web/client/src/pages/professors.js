import {useContext} from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import Navbar from '../components/navbar';
import { GetGroups } from '../components/GetGroups';
import {GetAvailSchedule} from '../components/GetAvailSchedule';

function Professors(props){

    // user data lives in here 
    const {user} = useContext(AuthContext);

    return (
        <>
        <Navbar />

            <div className="userInfo">
                <p style={{textAlign:"left", margin:0}}>{user.email}</p>
                <p style={{textAlign:"left", margin:0}}>{user.firstname}</p>
                <p style={{textAlign:"left", margin:0}}>{user.lastname}</p>
                
                <br />

                <GetGroups />

                <br />
                <GetAvailSchedule />

              </div>
        </>

    )
}

export default Professors