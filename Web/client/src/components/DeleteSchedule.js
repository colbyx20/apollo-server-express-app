

import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext';
import { GetGroups, GET_GROUPS } from './GetGroups';
import { Button } from "@mui/material";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from 'graphql-tag';
import '../components/css/coordinator.css';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

const DELETE_COORDINATOR_SCHEDULE = gql`
    mutation Mutation($cid: ID) {
        deleteCoordiantorSchedule(CID: $cid)
    }
`


export const DeleteSchedule = () => {

    const { user } = useContext(AuthContext);
    const [open, setIsOpen] = useState(false);
    const { refetch } = useQuery(GET_GROUPS, {
        variables: { coordinatorId: user.id }
    });
    const [deleteCoordiantorSchedule, { loading }] = useMutation(DELETE_COORDINATOR_SCHEDULE)

    function deleteCoordinatorSchedule() {
        setIsOpen(true);
        deleteCoordiantorSchedule({
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
                        height: '50px',
                        ':hover': {
                            bgcolor: '#8B0000', // On hover
                            color: 'white',
                        }
                    }} variant="contained" onClick={() => deleteCoordinatorSchedule()}>Delete Schedule</Button>
            }
        </>
    )
}