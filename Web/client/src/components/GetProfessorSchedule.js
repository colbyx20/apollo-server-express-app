import { gql, useMutation, useQuery } from '@apollo/client';
import * as React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import '../components/css/calendar2.css'

const GET_PROFESSOR = gql`
query GetProfessor($id: ID!) {
    getProfessor(ID: $id) {
        _id
        availSchedule
    }
}
`


export const GetProfessorSchedule = () => {

    const { user } = useContext(AuthContext);
    const { loading, error, data, refetch } = useQuery(GET_PROFESSOR, {
        variables: { id: user.id }
    });

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    function returnPrettyDateTime(date1) {
        let date = new Date(date1);

        date.setHours(date.getHours() - 4);
        const edtTime = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: "America/New_York" });
        return edtTime;
    }


    return (
        <div className='viewItem'>{data.getProfessor.availSchedule.map((time, index) => {
            return <div className='itemValue' key={index}>{time}</div>
        })}</div>
    )

}