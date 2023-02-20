import {useContext, useState} from 'react';
import { AuthContext } from '../context/authContext'; 
import CustomSidebar from '../components/Sidebar';
import { GetGroups } from '../components/GetGroups';
import { useNavigate } from 'react-router-dom';
import {Button, TextField, InputAdornment, Input} from "@mui/material";
import Search from '../components/images/search.svg'
import '../components/css/coordinator.css';
import FileUpload from '../components/FileUpload';

// import {GetAvailSchedule} from '../components/GetAvailSchedule';

function Professors(props){

   // user data lives in here 
    const {user, logout} = useContext(AuthContext);
    let navigate = useNavigate();
    var year = new Date().getFullYear()


    const onLogout = () => {
        logout();
        navigate('/');
    }

    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    return (
        <>
         <div className='coordPage'>
            {user !== null?
                <>
                <CustomSidebar/>
                <div className='coordWrapper'>
                    <div className='userInfo'>
                        <p className='coordHeader'>Home Page</p>
                    </div>
                    <div className='searchWrapper'>
                        <div className='searchBar'>
                        
                            <input className='searchInput'
                            type="text"
                            placeholder="Search"
                            onChange={handleChange}
                            value={searchInput}
                            />
                            
                        </div>
                        <div className='searchResults'>
                            <GetGroups
                            data={searchInput}/>
                        </div>
                    </div>
                    <div className='importerWrapper'>
                        <div className='importer'>
                            <FileUpload/>
                        </div>
        
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

export default Professors