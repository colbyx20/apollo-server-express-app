import {useContext} from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import Navbar from '../components/navbar';
// import { GetGroups } from '../components/GetGroups';
// import {GetAvailSchedule} from '../components/GetAvailSchedule';

function Professors(props){

    // user data lives in here 
    const {user} = useContext(AuthContext);
    const firstname = localStorage.getItem("firstname");
    const lastname = localStorage.getItem("lastname");
    const email = localStorage.getItem('email');

    return (
        <>
        <Navbar />

            <div className="userInfo">
                <p style={{textAlign:"left", margin:0}}>{email}</p>
                <p style={{textAlign:"left", margin:0}}>{firstname}</p>
                <p style={{textAlign:"left", margin:0}}>{lastname}</p>
                
                <br />

                {/* <GetGroups /> */}

                <br />
                {/* <GetAvailSchedule /> */}

              </div>
        </>

    )
}

export default Professors