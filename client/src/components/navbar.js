import {AppBar, Box, Toolbar, Typography, Button} from '@mui/material';
import {Link} from 'react-router-dom';
import { AuthContext } from '../context/authContext'; 
import {useContext} from 'react';
import { useNavigate } from 'react-router-dom';


function Navbar(){

    let navigate = useNavigate();

    const {user, logout} = useContext(AuthContext);

    const onLogout = () => {
        logout();
        navigate('/');
    }

    console.log("From Navbar");
    console.log(user);


    const firstname = localStorage.getItem("firstname");
    const lastname = localStorage.getItem("lastname");
    const privilege = localStorage.getItem("privilege");

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
            <AppBar position="static" style={{ background: '#000000' }}>
                <Toolbar>
                    <Typography varient='h5' component='div'>
                        <Link style={{textDecoration:"none",color:"white"}}>Welcome {privilege} {lastname}</Link>
                    </Typography>
                    <Box alignItems="right" sx={{
                        flexGrow:1,textAlign:"right",}}>
                        {privilege === 'student'?
                            <>
                                <Button
                                style={{textDecoration:"center", color: "white"}}
                                sx={{marginRight: '2%'}}
                                >Avalabilities</Button>

                                <Button
                                style={{textDecoration:"center", color: "white"}}
                                sx={{marginRight: '2%'}}
                                >Group Members</Button>

                                <Button
                                style={{textDecoration:"none", color:"white"}}
                                onClick={onLogout}>Student Logout</Button>
                            </>
                            :
                        privilege === 'professor'?
                            <>
                                <Button style={{textDecoration:"none", color:"white"}} onClick={onLogout}>Prof Logout</Button>
                            </>
                            :
                            <>
                                <Button style={{textDecoration:"none", color:"white"}} onClick={onLogout}>Prof Logout</Button>
                            </>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar;