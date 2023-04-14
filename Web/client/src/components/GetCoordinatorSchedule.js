import { gql, useQuery, NetworkStatus, useMutation } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import './css/getgroups.css';

const GET_SCHEDULE = gql`
    query GetCoordinatorSchedule($cid: String) {
        getCoordinatorSchedule(CID: $cid) {
            _id
            time
            room
            numberOfAttending
            groupId {
                groupName
                groupNumber
            }
            attending2 {
                fullName
            }
        }
    }
`

const GENERATE_APPOINTMENT = gql`
    mutation RandomlySelectProfessorsToAGroup($cid: ID!, $fullName: String) {
    RandomlySelectProfessorsToAGroup(CID: $cid, fullName: $fullName)
    }
`
const CANCEL_APPOINTMENT = gql`
    mutation CancelAppontment($cancelation:cancelation){
        cancelAppointment(cancelation:$cancelation)
    }
`

export const GetCoordinatorSchedule = ({ ID }) => {
    const { user } = useContext(AuthContext);
    console.log(user.firstname)
    console.log(user.lastname)

    const [schedule, setSchedule] = useState([]);
    const [randomlySelectProfessorsToAGroup] = useMutation(GENERATE_APPOINTMENT);
    const [isHeld, setIsHeld] = useState(false);
    const [holdTimeout, setHoldTimeout] = useState(null);
    const [cancel, setCancel] = useState("HOLD TO CANCEL");
    const holdTime = 2800;


    const { loading, error, data, networkStatus } = useQuery(GET_SCHEDULE, {
        variables: { cid: ID },
        notifyOnNetworkStatusChange: true
    });

    useEffect(() => {
        if (data) {
            setSchedule(data.getCoordinatorSchedule);
        }
    }, [data])

    const [cancelAppointment] = useMutation(CANCEL_APPOINTMENT)

    const handleMouseDown = (appointment) => {
        setIsHeld(true);
        setHoldTimeout(
            setTimeout(() => {
                onHoldComplete(appointment);
                setHoldTimeout(null);
            }, holdTime)
        );
    };

    const onHoldComplete = (appointment) => {
        cancelAppointment({
            variables: { cancelation: { CancelerID: ID, ApID: appointment, reason: "Personal" } },
            refetchQueries: [{ query: GET_SCHEDULE, variables: { cid: ID } }]
        })
    };

    const handleMouseUp = () => {
        if (isHeld) {
            setIsHeld(false);
            if (holdTimeout !== null) {
                clearTimeout(holdTimeout);
            }
        }
    };

    if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`


    function handleCreateGenerateViewers(e, ID, firstname, lastname) {
        randomlySelectProfessorsToAGroup({
            variables: { cid: ID, fullName: firstname + ' ' + lastname },
            refetchQueries: [{ query: GET_SCHEDULE, variables: { cid: ID } }]
        })
    }

    function returnCurrentDateTime(date1) {
        let date = new Date(date1);

        date.setHours(date.getHours() - 4);
        const edtTime = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: "America/New_York" });
        return edtTime;
    }

    return (
        <TableContainer component={Paper} sx={{ bgcolor: '#231F20', height: '455px', overflow: 'none' }}>
            <div className='StickyHeader'>
                <Button sx={{ float: 'right', color: 'white', bgcolor: '#1976d2' }} variant='Contained' onClick={(e) => handleCreateGenerateViewers(e, ID, user.firstname, user.lastname)}>Generate</Button>
            </div>
            <Table>
                <TableBody>
                    {schedule.map((coordinator) => {
                        return (<TableRow
                            key={coordinator._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: 'white' }}
                        >
                            <TableCell sx={{ color: 'white' }} align='center'>
                                {'Time:'}
                                <br />
                                {new Date(coordinator.time).toLocaleDateString('en-US', { month: 'long' })}{' '}
                                {new Date(coordinator.time).getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })}
                                {new Date(coordinator.time).getDate() % 10 === 1 ? 'st' : new Date(coordinator.time).getDate() % 10 === 2 ? 'nd' : new Date(coordinator.time).getDate() % 10 === 3 ? 'rd' : 'th'},{' '}
                                {/* {new Date(coordinator.time).toLocaleTimeString('en-US', {  timeZone: 'America/New_York',hour: 'numeric', minute: 'numeric', hour12: true })} */}
                                {returnCurrentDateTime(coordinator.time)}
                            </TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'>{'Room:'}<br />{coordinator.room} </TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'>{'Project:'}<br />{coordinator.groupId?.groupName}</TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'>{'Attending:'}<br />{coordinator.attending2?.map((e) => {
                                return <span sx={{ color: 'white' }} align='right' key={e._id}>{e?.fullName}<br /></span>
                            })}</TableCell>
                            <TableCell>
                                <Button
                                    sx={{
                                        backgroundColor: 'red',
                                        ':hover': {
                                            bgcolor: '#8B0000', // On hover
                                            color: 'white',
                                        }
                                    }}
                                    onMouseDown={() => handleMouseDown(coordinator._id)}
                                    onMouseUp={handleMouseUp}
                                    onTouchStart={() => handleMouseDown(coordinator._id)}
                                    onTouchEnd={handleMouseUp}
                                    variant="contained">
                                    {cancel}
                                </Button>
                            </TableCell>
                        </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
