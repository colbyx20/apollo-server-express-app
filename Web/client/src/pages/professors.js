import {useContext, useState} from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import {gql, useQuery} from '@apollo/client';
import Navbar from '../components/navbar';
import { TableBody } from '@mui/material';
import { GetGroups } from '../components/GetGroups';
import {GetAvailSchedule} from '../components/GetAvailSchedule';

function Professors(props){

    // user data lives in here 
    const {user,logout} = useContext(AuthContext);


    
    // const {loading, error, data} = useQuery(GET_GROUPS);
    // const {loading, error, data} = useQuery(GET_AVAILABLE_SCHEDULE);

    // console.log(data);

    // if(loading) return 'Loading...';
    // if(error) return `Error! ${error.message}`


    

    console.log("user data:: ----------------");
    console.log(user);

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