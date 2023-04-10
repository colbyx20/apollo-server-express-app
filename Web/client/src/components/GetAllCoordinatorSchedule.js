import { gql, useQuery } from '@apollo/client';
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
query Query {
    getAllCoordinatorSchedule {
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

const QUERY2 = gql`
query Query {
  getAllCoordinatorSchedule {
    _id
    coordinator {
      CID
      name
      room
    }
  }
}

`


export const GetAllCoordinatorSchedule = (props) => {


    const { loading, error, data } = useQuery(QUERY2);
    const [checkedStates, setCheckedStates] = React.useState([]);
    console.log(data);
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
                            key={coordinator.uniqueId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, color: 'white' }}
                        >
                            <TableCell sx={{ color: 'white' }} align='center'>
                                {new Date(coordinator._id).toLocaleDateString('en-US', { month: 'long' })}{' '}
                                {new Date(coordinator._id).getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })}
                                {new Date(coordinator._id).getDate() % 10 === 1 ? 'st' : new Date(coordinator._id).getDate() % 10 === 2 ? 'nd' : new Date(coordinator._id).getDate() % 10 === 3 ? 'rd' : 'th'},{' '}
                                {returnCurrentDateTime(coordinator._id)}
                            </TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'> {coordinator.coordinator?.room} </TableCell>
                            <TableCell sx={{ color: 'white' }} align='left'> {coordinator.coordinator?.name} </TableCell>
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
