import './css/sidebar.css'
import {Button} from '@mui/material';
import {AuthContext} from '../context/authContext'; 
import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {datasidebar} from './datasidebar';
import {studentsidebar} from './studentsidebar';
import { professorsidebar } from './professorsidebar';
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
                            {studentsidebar.map((val, key) => {
                                return( 
                                <li key={key} className='row'
                                id = {window.location.pathname == val.link ? "active" : ""}
                                onClick={() => {
                                    ButtonRouting(val.link);
                                    window.location.pathname = val.link;
                                }}>
                                    <div className='item'>{val.icon}{val.title}</div> 
                                </li>)
                            })}
                        </ul>
                    </div>
                   
                </>
                : user.privilege === 'professor'?
                <>
                    <div className='coordinatorBar'>
                        <ul className='coordList'>
                            {professorsidebar.map((val, key) => {
                                return( 
                                <li key={key} className='row'
                                id = {window.location.pathname == val.link ? "active" : ""}
                                onClick={() => {
                                    ButtonRouting(val.link);
                                    window.location.pathname = val.link;
                                }}>
                                    <div className='item'>{val.icon}{val.title}</div> 
                                </li>)
                            })}
                        </ul>
                    </div>
                </>
                :
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
                                    <div className='item'>{val.icon}{val.title}</div> 
                                </li>)
                            })}
                        </ul>
                    </div>
                </>
            }
           
        </div>
    )
}

export default Sidebar;