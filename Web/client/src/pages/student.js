import {useContext, useState} from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import {useForm} from "../utility/hooks";
import {useMutation} from "@apollo/react-hooks";
import {gql} from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar"

function Student(props){

    // user data lives in here 
    const {user} = useContext(AuthContext);

    let navigate = useNavigate();


    return (
        <>
            <Sidebar />
        </>

    )
}

export default Student;