import {useContext, useEffect} from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import {useForm} from "../utility/hooks";
import {useMutation} from "@apollo/react-hooks";
import {gql} from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import {Button} from "@mui/material";
import CustomSidebar from '../components/Sidebar';
import "../components/css/student.css";


function Student(props){

    // user data lives in here 
    const {user,logout} = useContext(AuthContext);
    console.log("From Student Page");
    console.log(user);
    let navigate = useNavigate();

    var year = new Date().getFullYear()

    const onLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <>
            <div className='studentPage'>
                {user !== null?
                    <>
                    <CustomSidebar/>
                    <div className='studentWrapper'>
                        <div className='userInfo'>
                            <p className='studentHeader'>Home Page</p>
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

export default Student