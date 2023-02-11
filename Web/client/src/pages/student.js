import {useContext, useEffect} from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import {useForm} from "../utility/hooks";
import {useMutation} from "@apollo/react-hooks";
import {gql} from 'graphql-tag';
import { Navigate, useNavigate } from 'react-router-dom';
import {TextField, Button, Container, Stack, Alert, AlertTitle} from "@mui/material";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import CustomSidebar from '../components/Sidebar';
import "../components/css/student.css";
import { color } from '@mui/system';

function Student(props){

    // user data lives in here 
    const {user,logout} = useContext(AuthContext);

    let navigate = useNavigate();

    var year = new Date().getFullYear()

    const onLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <div className='studentPage'>
            {user !== null?
                <>
                <CustomSidebar/>
                <div className="userInfo">
                    <p style={{textAlign:"left", margin:0}}>{user.email}</p>
                    <p style={{textAlign:"left", margin:0}}>{user.firstname}</p>
                    <p style={{textAlign:"left", margin:0}}>{user.lastname}</p>
                    <p style={{textAlign:"left", margin:0}}>{year}</p>
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

    )
}

export default Student