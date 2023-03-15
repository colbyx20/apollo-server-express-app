import { gql, useQuery } from '@apollo/client';
// import './css/getgroups.css';

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


// const GET_SCHEDULE = gql`
//     query GetAllCoordinatorSchedule {
//         getAllCoordinatorSchedule {
//             _id
//             time
//             room
//             numberOfAttending
//             groupId {
//                 groupName
//                 groupNumber
//             }
//             attending2 {
//                 fullName
//             }
//         }
//     }
// `

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

export const GetCoordinatorSchedule = (props) => {

    const CID = localStorage.getItem('_id');
    console.log(CID);

    const { loading, error, data } = useQuery(GET_SCHEDULE, {
        variables: { cid: CID }
    });

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`

    const search = props.data;
    const { getCoordinatorSchedule } = data;
    console.log("FETCH!!");
    console.log(getCoordinatorSchedule)
    // const filterItems = getFilteredData(search, getAllCoordinatorSchedule);


    return (

        <TableContainer component={Paper} sx={{ bgcolor: '#231F20' }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
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
                            <TableCell sx={{ color: 'white' }} align='left'>{coordinator.time}</TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'> {coordinator.room} </TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'>{coordinator.groupId.groupName}</TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'>{coordinator.groupId.groupNumber}</TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'>{coordinator.attending2.map((e) => {
                                return <TableCell sx={{ color: 'white' }} align='right' key={e._id}>{e.fullName}</TableCell>
                            })}</TableCell>
                        </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
