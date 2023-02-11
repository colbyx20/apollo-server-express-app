import {useContext} from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import Sidebar from '../components/Sidebar';
// import { GetGroups } from '../components/GetGroups';
// import {GetAvailSchedule} from '../components/GetAvailSchedule';

function Professors(props){

    // user data lives in here 
    const {user} = useContext(AuthContext);


    return (
        <>
        <div>
            <Sidebar />
        </div>

        </>

    )
}

export default Professors