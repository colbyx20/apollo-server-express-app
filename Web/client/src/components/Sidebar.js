import './css/sidebar.css'
import {Link} from 'react-router-dom';
import {Box, Typography, Button} from '@mui/material';
import {AuthContext} from '../context/authContext'; 
import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {datasidebar} from './datasidebar';
import Logo from './images/ucfLogo.png'


function Sidebar(props){

    let navigate = useNavigate();

    // all user data lives here
    const {user, logout} = useContext(AuthContext);

    const onLogout = () => {
        logout();
        navigate('/');
    }

    if(user.firstname === ""){
        navigate('/');
    }

    function Formatter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function ButtonRouting(link){
        console.log(link);
        if(link === "/")
            onLogout();
    }
      
    return(
        <div className='sideBar-wrapper'>
            <img className='ucfLogo' src={Logo} alt="/"></img>
            <h3 className='ucfText'>UCF</h3>
            {user.privilege === 'student'?
                <>
                    <div className='coordinatorBar'>
                        <ul className='coordList'>
                            {datasidebar.map((val, key) => {
                                return( 
                                <li key={key} className='row'
                                id = {window.location.pathname == val.link ? "active" : ""}
                                onClick={() => {
                                    ButtonRouting(val.link);
                                    window.location.pathname = val.link;
                                }}>
                                    <div>{val.icon}{val.title}</div> 
                                </li>)
                            })}
                        </ul>
                    </div>
                    
                </>
                : user.privilege === 'professor'?
                <>
                    <Button style={{textDecoration:"none", color:"white"}} onClick={onLogout}>Prof Logout</Button>
                </>
                :
                <>
                    <Button style={{textDecoration:"none", color:"white"}} onClick={onLogout}>Prof Logout</Button>
                </>
            }
           
        </div>
    )
}

export default Sidebar;