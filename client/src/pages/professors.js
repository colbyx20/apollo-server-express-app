import {useContext, useState} from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import {useForm} from "../utility/hooks";
import {useMutation} from "@apollo/react-hooks";
import {gql} from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import {TextField, Button, Container, Stack, Alert, AlertTitle} from "@mui/material";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Navbar from '../components/navbar';

function Professors(props){

    // user data lives in here 
    const {user,logout} = useContext(AuthContext);


    console.log("user data:: ----------------");
    console.log(user);

    return (
        <>
        <Navbar />

            <div className="userInfo">
                <p style={{textAlign:"left", margin:0}}>{user.email}</p>
                <p style={{textAlign:"left", margin:0}}>{user.firstname}</p>
                <p style={{textAlign:"left", margin:0}}>{user.lastname}</p>
            </div>

        </>

    )
}

export default Professors