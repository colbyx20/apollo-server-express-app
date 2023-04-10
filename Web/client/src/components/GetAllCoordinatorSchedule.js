import { gql, useQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { useContext } from 'react';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './css/getgroups.css';
import { Button, Checkbox } from '@mui/material';

const GET_All_COORDINATOR_SCHEDULE = gql`
query Query($id: ID) {
    getAllCoordinatorSchedule(ID: $id) {
        _id
        coordinatorInfo {
            _id
            coordinatorFName
            coordinatorLName
        }
        time
        room
        numberOfAttending
        groupId {
            groupName
            groupNumber
            projectField
        }
        attending2 {
            _id
            fullName
        }
    }
}
`


export const GetAllCoordinatorSchedule = (props) => {

    const { user } = useContext(AuthContext);

    const { loading, error, data } = useQuery(GET_All_COORDINATOR_SCHEDULE, {
        variables: { id: user.id }
    });

    const [checkedStates, setCheckedStates] = React.useState([]);


    const handleChange = (event) => {
        checkedStates.push(event)
    };

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`

    const search = props.data;
    const { getAllCoordinatorSchedule } = data;

    function returnCurrentDateTime(date1) {
        let date = new Date(date1);

        date.setHours(date.getHours() - 4);
        const edtTime = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: "America/New_York" });
        return edtTime;
    }

    return (
        <TableContainer component={Paper} sx={{ bgcolor: '#231F20', width: '100%' }}>
            <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
                <TableHead >
                    <TableRow sx={{ color: 'white' }}>
                        <TableCell sx={{ color: 'white' }} align='center'>Time</TableCell>
                        <TableCell sx={{ color: 'white' }} align='left'>Room</TableCell>
                        <TableCell sx={{ color: 'white' }} align='left'>Coordinator</TableCell>
                        <TableCell sx={{ color: 'white' }} align='left'>Selection</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getAllCoordinatorSchedule.map((coordinator, index) => {
                        return (<TableRow
                            key={coordinator._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: 'white' }}
                        >
                            <TableCell sx={{ color: 'white' }} align='center'>
                                {new Date(coordinator.time).toLocaleDateString('en-US', { month: 'long' })}{' '}
                                {new Date(coordinator.time).getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })}
                                {new Date(coordinator.time).getDate() % 10 === 1 ? 'st' : new Date(coordinator.time).getDate() % 10 === 2 ? 'nd' : new Date(coordinator.time).getDate() % 10 === 3 ? 'rd' : 'th'},{' '}
                                {returnCurrentDateTime(coordinator.time)}
                            </TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'> {coordinator.room} </TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'> {coordinator.coordinatorInfo?.coordinatorFName + ' ' + coordinator.coordinatorInfo?.coordinatorLName} </TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'> <Checkbox onChange={() => handleChange(index)} />
                            </TableCell>

                        </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
