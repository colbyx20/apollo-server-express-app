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


const GET_SCHEDULE = gql`
    query GetAllCoordinatorSchedule {
        getAllCoordinatorSchedule {
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

// const getFilteredData = (query, items) => {
//     if (!query) {
//         return items;
//     }
//     return items.filter(group => group._id.toString().toLowerCase().includes(query.toLowerCase()) || group._id.toString().includes(query))
// }

export const GetCoordinatorSchedule = (props) => {

    const { loading, error, data } = useQuery(GET_SCHEDULE);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`

    const search = props.data;
    const { getAllCoordinatorSchedule } = data;
    console.log(getAllCoordinatorSchedule)
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
                    {getAllCoordinatorSchedule.map((coordinator) => {
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
        // return (
        //     <tr key={coordinator._id}>
        //         <td id='rowNumber'>
        //             <div >
        //                 Time: {coordinator.time} <br />
        //                 Room: {coordinator.room} <br />
        //                 Group: {coordinator.groupId.groupName} <br />
        //                 Attending: {coordinator.attending2.map((e) => {
        //                     return <tr key={e._id}>{e.fullName}</tr>
        //                 })}<br />
        //             </div>
        //         </td>
        //     </tr>
        // )