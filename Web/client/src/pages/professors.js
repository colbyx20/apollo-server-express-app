import {useContext} from 'react';
import { AuthContext } from '../context/authContext'; 
import Sidebar from '../components/Sidebar';
import { GetGroups } from '../components/GetGroups';
// import {GetAvailSchedule} from '../components/GetAvailSchedule';

function Professors(props){

    // user data lives in here 
    // const {user} = useContext(AuthContext);


    return (
        <>
        <div style = {{display:"flex"}}>
            <Sidebar />
            <div>
                <GetGroups />
            </div>
        </div>

        </>

    )
}

export default Professors