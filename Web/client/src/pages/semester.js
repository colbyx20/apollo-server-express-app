import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import CustomSidebar from '../components/Sidebar';
import { GetGroups } from '../components/GetGroups';
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import { useMutation } from "@apollo/react-hooks";
import { gql } from 'graphql-tag';
import '../components/css/coordinator.css';
import FileUpload from '../components/FileUpload';
import { GET_GROUPS } from '../components/GetGroups';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { DeleteProjects } from '../components/DeleteProjects'
import { DeleteSchedule } from '../components/DeleteSchedule'

const DELETE_ALL_GROUP = gql`
    mutation DeleteAllGroups($cid: ID) {
        deleteAllGroups(CID: $cid)
  }`

function Semester(props) {
    const [searchInput, setSearchInput] = useState("");
    const { user, logout } = useContext(AuthContext);
    let navigate = useNavigate();
    const [open, setIsOpen] = useState(false);
    var year = new Date().getFullYear()
    const [deleteAllG, { loading: deleteAllGLoading }] = useMutation(DELETE_ALL_GROUP)


    const onLogout = () => {
        logout();
        navigate('/');
    }

    function deleteGroups() {
        setIsOpen(true);
        deleteAllG({
            variables: { cid: user.id },
            refetchQueries: [{ query: GET_GROUPS, variables: { coordiantorId: user.id } }],
            onCompleted: setIsOpen(false)
        });
    }

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    return (
        <>
            <div className='coordPage'>
                {user !== null ?
                    deleteAllGLoading ?
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={true}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        :
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
                                        <DeleteProjects />
                                        <DeleteSchedule />
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