import { gql, useQuery, NetworkStatus, useMutation } from '@apollo/client';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

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
    mutation RandomlySelectProfessorsToAGroup($cid: ID!) {
    RandomlySelectProfessorsToAGroup(CID: $cid)
    }

`

export const GetCoordinatorSchedule = ({ ID }) => {

    const { loading, error, data, refetch, networkStatus } = useQuery(GET_SCHEDULE, {
        variables: { cid: ID },
        notifyOnNetworkStatusChange: true,
    });

    const [randomlySelectProfessorsToAGroup] = useMutation(GENERATE_APPOINTMENT);

    if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`

    const { getCoordinatorSchedule } = data;

    function handleCreateGenerateViewers(e, ID) {
        e.preventDefault()
        randomlySelectProfessorsToAGroup({
            variables: { cid: ID },
        }).then(() => { refetch() });
    }

    return (
        <TableContainer component={Paper} sx={{ bgcolor: '#231F20', height: '455px', overflow: 'auto' }}>
            <Button sx={{ color: 'white', bgcolor: '#1976d2' }} variant='Contained' onClick={() => refetch()}>Refetch</Button>
            <Button sx={{ color: 'white', bgcolor: '#1976d2' }} variant='Contained' onClick={(e) => handleCreateGenerateViewers(e, ID)}>Generate</Button>
            <Table stickyTable aria-label="sticky table">
                <TableHead >
                    <TableRow sx={{ color: 'white' }}>
                        <TableCell sx={{ color: 'white' }} align='left'>Time</TableCell>
                        <TableCell sx={{ color: 'white' }} align='left'>Room</TableCell>
                        <TableCell sx={{ color: 'white' }} align='left'>Group Name</TableCell>
                        <TableCell sx={{ color: 'white' }} align='left'>Group Number</TableCell>
                        <TableCell sx={{ color: 'white' }} align='left'>Attending</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getCoordinatorSchedule.map((coordinator) => {
                        return (<TableRow
                            key={coordinator._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: 'white' }}
                        >
                            <TableCell sx={{ color: 'white' }} align='left'>
                                {new Date(coordinator.time).toLocaleDateString('en-US', { month: 'long' })}{' '}
                                {new Date(coordinator.time).getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })}{new Date(coordinator.time).getDate() % 10 === 1 ? 'st' : new Date(coordinator.time).getDate() % 10 === 2 ? 'nd' : new Date(coordinator.time).getDate() % 10 === 3 ? 'rd' : 'th'},{' '}
                                {new Date(coordinator.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                            </TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'> {coordinator.room} </TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'>{coordinator.groupId?.groupName}</TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'>{coordinator.groupId?.groupNumber}</TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'>{coordinator.attending2?.map((e) => {
                                return <span sx={{ color: 'white' }} align='right' key={e._id}>{e?.fullName}<br /></span>
                            })}</TableCell>
                        </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}