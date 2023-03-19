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

    function cancelAppointment(professorId, scheduleId) {
        console.log(`scheduleID ${scheduleId}`);
        console.log(`professorId ${professorId}`);

    }

    return (
        <table style={{ color: "white" }}>
            {schedule.map((s) => {
                return (
                    <tbody key={s._id}>
                        <tr style={{ color: "black" }}>
                            <td>{s.time}</td>
                            <td>{s.room}</td>
                            <td>{s.groupName}</td>
                            <td>{s.groupNumber}</td>
                            <td>
                                <button onClick={() => cancelAppointment(PID, s._id)}>Cancel Meeting</button>
                            </td>
                        </tr>
                    </tbody>
                );
            })}
        </table>
    );
}