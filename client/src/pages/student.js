import {useContext, useState} from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import {useForm} from "../utility/hooks";
import {useMutation} from "@apollo/react-hooks";
import {gql} from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import {TextField, Button, Container, Stack, Alert, AlertTitle} from "@mui/material";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

function Student(props){

    // user data lives in here 
    const {user,logout} = useContext(AuthContext);

    console.log("user data:: ----------------");
    console.log(user);

    return (
        <>
            <Sidebar>
                <Menu>
                    <SubMenu label="About">
                        <MenuItem> Account Information </MenuItem>
                        <MenuItem> Group </MenuItem>
                    </SubMenu>
                        <MenuItem> Schedule </MenuItem>
                </Menu>
            </Sidebar>;

            <div className="userInfo">
                <p>{user.email}</p>
            </div>

        </>

    )
}

export default Student