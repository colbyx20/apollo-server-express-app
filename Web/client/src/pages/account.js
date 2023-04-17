import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { ThemeContext } from '../context/themeContext'
import { GetUserInfo } from '../components/GetUserInfo';
import CustomSidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Button, Switch, Grid, Alert } from "@mui/material";
import '../components/css/account.css'
import EditEmailPopup from '../components/EditEmail';
import EditPassword from '../components/EditPassword';
import { gql, useMutation } from '@apollo/client';


const UPDATE_USER_PASSWORD = gql`
    mutation Mutation($id: String!, $oldPassword: String!, $newPassword: String!, $confirmedPassword: String!) {
        updatePassword(ID: $id, oldPassword: $oldPassword, newPassword: $newPassword, confirmedPassword: $confirmedPassword)
    }
`

function Account(props) {

    // user data lives in here 
    const { user, logout } = useContext(AuthContext);
    const theme = useContext(ThemeContext)
    let navigate = useNavigate();

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileUpdate, setProfileUpdate] = useState(false);
    const [errors, setErrors] = useState([])

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

    const [updatePassword] = useMutation(UPDATE_USER_PASSWORD);
    const handlePasswordChangeSubmit = async (oldPassword, newPassword) => {

        await updatePassword({
            variables: {
                id: user.id,
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmedPassword: newPassword
            },
            onError({ graphQLErrors }) {
                setErrors(graphQLErrors);
            },
            onCompleted() {
                setProfileUpdate(true);
            }
        })
    }

    const onLogout = () => {
        logout();
        navigate('/');
    }
    return (
        <>
            <div className='accountPage'>
                {user !== null ?
                    <>
                        <CustomSidebar />
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
                                        }} variant="contained">Email</Button>

                                    <Button
                                        onClick={handleModalOpen}
                                        sx={{
                                            display: 'block',
                                            marginRight: 'auto',
                                            marginLeft: 'auto',
                                            marginBottom: '5px',
                                            width: '55%',
                                        }} variant="contained">Password</Button>
                                    {/* <Alert severity="success" className='passwordUpdate'>{profileUpdate}</Alert> */}
                                    {errors.length ? (
                                        <>
                                            {errors.map((error) => (
                                                <Alert className='passwordUpdate' severity="error">{error.message}</Alert>
                                            ))}
                                        </>
                                    ) : profileUpdate ? (
                                        <Alert className='passwordUpdate' severity="success">Password Successfully Change</Alert>
                                    ) : null}
                                </div>
                                <div className='toggleTheme'>
                                    <h2 className='themeTitle'>Toggle Theme</h2>
                                    <Grid className='button' component="label" container alignItems="center">
                                        <Grid item>Darkmode</Grid>
                                        <Grid item>
                                            <Switch
                                                value="checkedA"
                                                checked={theme.theme === 'light' ? true : false}
                                                onChange={() => {
                                                    theme.setTheme((curTheme) => curTheme === 'dark' ? 'light' : 'dark')
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>Lightmode</Grid>
                                    </Grid>
                                </div>
                            </div>

                            <div className='otherContainer'>
                                <div className='userData'>
                                    <h2 className='themeTitle'>Information</h2>
                                    <div className='userData-container'>
                                        <GetUserInfo />
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
                            <Button style={{ color: 'white' }} onClick={onLogout}>Redirect to Login</Button>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default Account