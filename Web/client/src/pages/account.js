import {useContext, useState} from 'react';
import { AuthContext } from '../context/authContext'; 
import CustomSidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import {Button, Switch, Grid,FormControlLabel} from "@mui/material";
import '../components/css/account.css'
import ImgUpload from '../components/ImgUpload';
import EditEmailPopup from '../components/EditEmail';
import EditPassword from '../components/EditPassword';

function Account(props){

    // user data lives in here 
    const {user, logout} = useContext(AuthContext);
    let navigate = useNavigate();

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditEmailClick = () => {
        setIsEditingEmail(true);
    };

    const handleEditEmailClose = () => {
        setIsEditingEmail(false);
    };

    const handleModalOpen = () => {
      setIsModalOpen(true);
    };
  
    const handleModalClose = () => {
      setIsModalOpen(false);
    };
  
    const handlePasswordChangeSubmit = (oldPassword, newPassword) => {
      // Handle password change submit logic here
      console.log(`Password changed from ${oldPassword} to ${newPassword}`);
    };

    const onLogout = () => {
        logout();
        navigate('/');
    }
    console.log(user)
    return (
        <>
            <div className='accountPage'>
                {user !== null?
                    <>
                        <CustomSidebar/>
                        <div className='accountWrapper'>
                            <div className='userInfo'>
                                <p className='accountHeader'>Account</p>
                            </div>

                            <div className='accountInformation'>
                                <div className='accountContainer'>
                                    <h2 className='accountTitle'>Profile Options</h2>
                                    <Button
                                    onClick={handleEditEmailClick} 
                                    sx={{
                                    display: 'block',
                                    marginTop: '5%',
                                    marginRight: 'auto',
                                    marginLeft: 'auto',
                                    marginBottom: '7px',
                                    width: '55%',
                                    }}variant="contained">Email</Button>

                                    <Button
                                    onClick={handleModalOpen}
                                    sx={{
                                        display: 'block',
                                        marginRight: 'auto',
                                        marginLeft: 'auto',
                                        marginBottom: '5px',
                                        width: '55%',
                                    }}variant="contained">Password</Button>
                                </div>

                                <div className='accountImporter'>
                                <ImgUpload />
                                </div>
                            </div>

                            <div className='otherContainer'>
                                <div className='toggleTheme'>
                                    <h2 className='themeTitle'>Toggle Theme</h2>
                                    <Grid className='button' component="label" container alignItems="center">
                                        <Grid item>Darkmode</Grid>
                                        <Grid item>
                                            <Switch
                                            value="checkedA"
                                            />
                                        </Grid>
                                        <Grid item>Lightmode</Grid>
                                    </Grid>
                                </div>
                                
                                <div className='userData'>
                                <h2 className='themeTitle'>Information</h2>
                                    <div className='userData-container'>
                                        <p className='user-data'>Name: {user.firstname} {user.lastname}</p>
                                        <p className='user-data'>Account Email: {user.email}</p>
                                        <p className='user-data'>Notification Email:{user.notificationEmail}</p>
                                    </div>
                                </div>
                                {isEditingEmail && (<EditEmailPopup onClose={handleEditEmailClose} />)}
                                {isModalOpen && (
                                    <EditPassword
                                    handleClose={handleModalClose}
                                    handlePasswordChangeSubmit={handlePasswordChangeSubmit}
                                    />
                                )} 
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

export default Account