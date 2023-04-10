import { gql, useMutation, useQuery } from '@apollo/client';
import * as React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

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
`;

const DELETE_APPOINTMENT = gql`
  mutation Mutation($professorId: String, $scheduleId: String) {
    deleteProfessorAppointment(professorId: $professorId, scheduleId: $scheduleId)
  }
`;

export const GetProfessorsAppointments = () => {
  const { user } = useContext(AuthContext);
  const PID = user.id
  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT);

  const { loading, error, data, refetch } = useQuery(GET_PROFESSOR_SCHEDULE, {
    variables: { profId: PID },
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const schedule = data.getProfessorsAppointments;

  function handleCancelAppointment(professorId, scheduleId) {
    deleteAppointment({
      variables: { professorId, scheduleId },
    }).then(() => refetch());
  }

  return (
    <table style={{ color: 'white' }}>
      {schedule.map((s) => (
        <tbody key={s._id}>
          <tr style={{ color: 'black' }}>
            <td>{s.time}</td>
            <td>{s.room}</td>
            <td>{s.groupName}</td>
            <td>{s.groupNumber}</td>
            <td>
              <button onClick={() => handleCancelAppointment(PID, s._id)}>Cancel Meeting</button>
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  );
};