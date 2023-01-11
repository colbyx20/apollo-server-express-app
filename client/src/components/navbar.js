import {AppBar, Box, Toolbar, Typography, Button} from '@mui/material';
import {Link} from 'react-router-dom';
import { AuthContext } from '../context/authContext'; 
import {useContext} from 'react';
import { useNavigate } from 'react-router-dom';


const GROUP = gql`
    
`

function Navbar(){

    let navigate = useNavigate();

    const {user, logout} = useContext(AuthContext);

    const onLogout = () => {
        logout();
        navigate('/');
    }

    console.log("From Navbar");
    console.log(user);






    
    return(
        <Box sx={{flexGrow:1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography varient='h5' component='div'>
                        <Link to="/" style={{textDecoration:"none",color:"white"}}>Welcome {user? user.firstname + " " + user.lastname : " "}</Link>
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
        </Box>
    )
}

export default Navbar;