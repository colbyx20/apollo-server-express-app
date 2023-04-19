import { gql, useMutation, useQuery } from '@apollo/client';
import * as React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import '../components/css/calendar2.css'

export const GET_PROFESSOR = gql`
query GetProfessor($id: ID!) {
    getProfessor(ID: $id) {
        _id
        availSchedule
    }
}
`

const DELETE_PROFESSOR_AVAIL_SCHEDULE = gql`
    mutation Mutation($pid: ID, $time: String) {
    updateProfessorAvailSchedule(PID: $pid, time: $time)
    }
`


export const GetProfessorSchedule = ({ onUpdate }) => {

    const { user } = useContext(AuthContext);

    const { loading, error, data, refetch } = useQuery(GET_PROFESSOR, {
        variables: { id: user.id }
    });

    const [updateProfessorAvailSchedule] = useMutation(DELETE_PROFESSOR_AVAIL_SCHEDULE)

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    function updateDates(time) {
        updateProfessorAvailSchedule({
            variables: { pid: user.id, time: time },
            refetchQueries: [{ query: GET_PROFESSOR, variables: { id: user.id } }]
        })
    }

    function returnPrettyDateTime(date1) {
        let date = new Date(date1);

        date.setHours(date.getHours() - 4);
        const edtTime = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: "America/New_York" });
        return edtTime;
    }


    const RedButton = styled(Button)(({ theme }) => ({
        color: 'white',
        backgroundColor: '#f44336',
        '&:hover': {
            backgroundColor: '#d32f2f',
        },
        float: 'right',
        marginLeft: '50px',
    }));


    return (
        <div className='viewItem'>{data.getProfessor.availSchedule.map((time, index) => {
            return <div className='itemValue' key={index}>
                {new Date(time).toLocaleDateString('en-US', { month: 'long' })}{' '}
                {new Date(time).getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })}
                {new Date(time).getDate() % 10 === 1 ? 'st' : new Date(time).getDate() % 10 === 2 ? 'nd' : new Date(time).getDate() % 10 === 3 ? 'rd' : 'th'},{' '}
                {returnPrettyDateTime(time)}
                {/* <RedButton onClick={() => updateDates(time)}><DeleteForeverIcon /></RedButton> */}

                <Button variant="contained" color="secondary" size='small' style={{ backgroundColor: "red", marginLeft: '150px' }} onClick={() => updateDates(time)}>
                    <DeleteIcon />
                </Button>
            </div>
        })}</div>
    )

}