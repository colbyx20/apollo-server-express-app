import { gql, useQuery } from '@apollo/client';
import * as React from 'react';

const GET_PROFESSOR_SCHEDULE = gql`
    query GetProfessorsAppointments($profId: String) {
        getProfessorsAppointments(profId: $profId) {
            _id
            time
            room
            groupNumber
            groupName
        }
    }
`

export const GetProfessorsAppointments = (props) => {

    const PID = localStorage.getItem('_id');

    const { loading, error, data } = useQuery(GET_PROFESSOR_SCHEDULE, {
        variables: { profId: PID }
    })

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`

    const schedule = data.getProfessorsAppointments;
    console.log(schedule);

    return (
        <table style={{ color: "white" }}>{
            schedule.map((s) => {
                return <tbody>
                    <tr
                        style={{ color: "white" }}
                        key={s._id}>
                        <td>{s.time}</td>
                        <td>{s.room}</td>
                        <td>{s.groupName}</td>
                        <td>{s.groupNumber}</td>
                    </tr>
                </tbody>
            })
        }  </table>
    )
}