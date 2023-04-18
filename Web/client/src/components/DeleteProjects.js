

import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { GetGroups, GET_GROUPS } from '../components/GetGroups';
import { Button } from "@mui/material";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from 'graphql-tag';
import '../components/css/coordinator.css';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

const DELETE_ALL_GROUP = gql`
    mutation DeleteAllGroups($cid: ID) {
        deleteAllGroups(CID: $cid)
  }`


export const DeleteProjects = () => {

    const { user } = useContext(AuthContext);
    const [open, setIsOpen] = useState(false);
    const { refetch } = useQuery(GET_GROUPS, {
        variables: { coordinatorId: user.id }
    });
    const [deleteAllG, { loading }] = useMutation(DELETE_ALL_GROUP)

    function deleteGroups() {
        setIsOpen(true);
        deleteAllG({
            variables: { cid: user.id },
            refetchQueries: [{ query: GET_GROUPS, variables: { coordiantorId: user.id } }],
            onCompleted: () => setIsOpen(false)
        }).then(() => refetch());
    }


    return (
        <>
            {
                loading ?
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }
                        }
                        open={true}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop >
                    :

                    <Button sx={{
                        display: 'block',
                        backgroundColor: 'red',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        marginBottom: '5px',
                        width: '50%',
                        height: '100px',
                        ':hover': {
                            bgcolor: '#8B0000', // On hover
                            color: 'white',
                        }
                    }} variant="contained" onClick={() => deleteGroups()}>Delete Projects</Button>
            }
        </>
    )
}