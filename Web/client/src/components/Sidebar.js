import './css/sidebar.css'
import {Link} from 'react-router-dom';
import {Box, Typography, Button} from '@mui/material';
import {AuthContext} from '../context/authContext'; 
import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {datasidebar} from './datasidebar';
import {commonbuttons} from './commonbuttons'
import Logo from './images/ucfLogo.png'


function Sidebar(props){

    let navigate = useNavigate();

    const {logout} = useContext(AuthContext);

    const onLogout = () => {
        logout();
        navigate('/');
    }

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

    if(firstname === ""){
        navigate('/');
    }

    function Formatter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
      

    return(
        <div className='sideBar-wrapper'>
            <img className='ucfLogo' src={Logo} alt="/"></img>
            <h3 className='ucfText'>UCF</h3>
            {privilege === 'student'?
                <>
                    <div className='coordinatorBar'>
                        <ul className='coordList'>
                            {datasidebar.map((val, key) => {
                                return( 
                                <li key={key} className='row'>
                                    {" "}
                                    <div>{val.icon}</div>{" "}
                                    <div>{val.title}</div>
                                </li>)
                            })}
                        </ul>
                    </div>
                    
                </>
                : privilege === 'professor'?
                <>
                    <Button style={{textDecoration:"none", color:"white"}} onClick={onLogout}>Prof Logout</Button>
                </>
                :
                <>
                    <Button style={{textDecoration:"none", color:"white"}} onClick={onLogout}>Prof Logout</Button>
                </>
            }
            <div className='commonContainer'>
                <ul className='commonItems'>
                        {commonbuttons.map((val, key) =>{
                            return(
                                <li key={key}
                                className='row'
                                onClick={() => {
                                    onLogout();
                                }}
                                >
                                    <div>{val.icon}</div>
                                    <div>{val.title}</div>
                                </li>
                            )
                        })}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;