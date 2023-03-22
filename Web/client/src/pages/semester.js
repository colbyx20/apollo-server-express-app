import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import CustomSidebar from '../components/Sidebar';
import { GetGroups } from '../components/GetGroups';
import { GetGroupMembers } from '../components/GetGroupMembers';
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import {useMutation} from "@apollo/react-hooks";
import {gql} from 'graphql-tag';
import '../components/css/coordinator.css';
import FileUpload from '../components/FileUpload';
const DELETE_ALL_GROUP=gql `
    mutation DeleteAllGroups($cid: ID) {
        deleteAllGroups(CID: $cid)
  }`

function Semester(props) {
    // user data lives in here 
    const { user, logout } = useContext(AuthContext);
    let navigate = useNavigate();
    var year = new Date().getFullYear()


    const onLogout = () => {
        logout();
        navigate('/');
    }
    function deleteGroups(){
        deleteAllG()
    }
    const [deleteAllG, {loading}] = useMutation(DELETE_ALL_GROUP,{
        variables:{cid:localStorage.getItem("_id")}
    })

    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    return (
        <>
            <div className='coordPage'>
                {user !== null ?
                    <>
                        <CustomSidebar />
                        <div className='coordWrapper'>
                            <div className='userInfo'>
                                <p className='semesterHeader'>Semester Page</p>
                            </div>
                            <div className='searchWrapper'>
                                <div className='searchBar'>

                                    <input className='searchInput'
                                        type="text"
                                        placeholder="Search Projects"
                                        onChange={handleChange}
                                        value={searchInput}
                                    />

                                </div>
                                <div className='searchResults'>
                                    <GetGroups
                                        data={searchInput} />
                                </div>
                            </div>
                            <div className='importerWrapper'>
                                <div className='importer'>
                                    <FileUpload />
                                </div>
                                <div className='dangerZone'>
                                    <h2 className='dangerTitle'>Danger Zone</h2>
                                    <Button sx={{
                                        display: 'block',
                                        backgroundColor: 'red',
                                        marginRight: 'auto',
                                        marginLeft: 'auto',
                                        marginBottom: '5px',
                                        width: '50%',
                                        ':hover': {
                                            bgcolor: '#8B0000', // On hover
                                            color: 'white',
                                        }
                                    }} variant="contained" onClick={deleteGroups}>Delete Projects</Button> 
                                    <Button sx={{
                                        display: 'block',
                                        backgroundColor: 'red',
                                        marginRight: 'auto',
                                        marginLeft: 'auto',
                                        marginBottom: '5px',
                                        width: '50%',
                                        ':hover': {
                                            bgcolor: '#8B0000', // On hover
                                            color: 'white',
                                        }
                                    }} variant="contained" >Delete All</Button>
                                </div>

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

export default Semester