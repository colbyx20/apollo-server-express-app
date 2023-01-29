import {AppBar, Box, Toolbar, Typography, Button} from '@mui/material';
import {Link} from 'react-router-dom';
import { AuthContext } from '../context/authContext'; 
import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';


function Navbar(props) {

    let navigate = useNavigate();

    const {user, logout} = useContext(AuthContext);

    const onLogout = () => {
        logout();
        navigate('/');
    }

    // console.log("From Navbar");
    // console.log(user);


    let firstname = localStorage.getItem("firstname");
    let lastname = localStorage.getItem("lastname");
    let privilege = localStorage.getItem("privilege");

    if(firstname === undefined){
        firstname = "";
    }

    if(lastname === undefined){
        lastname = "";
    }

    if(privilege === undefined){
        privilege = "";
    }

    return(
        <Box sx={{flexGrow:1}}>
            <>
            <AppBar position="static">
                <Toolbar>
                    <Typography varient='h5' component='div'>
                        <Link to="/" style={{textDecoration:"none",color:"white"}}>Welcome {privilege} {lastname}</Link>
                    </Typography>
                    <Box alignItems="right" sx={{flexGrow:1,textAlign:"right"}}>
                        {user?
                            <>
                                <Button style={{textDecoration:"none", color:"white"}} onClick={onLogout}>Logout</Button>
                            </>
                                :
                            <>
                                <Link to="/login" style={{textDecoration:"none", color:"white", marginRight:'10px'}}> Login </Link>
                                <Link to="/register" style={{textDecoration:"none", color:"white"}}> Register </Link>
                            </>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
            </>
        </Box>
    )
}

export default Navbar;
