import { gql, useMutation, useQuery } from '@apollo/client';
import * as React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import '../components/css/getprofgroups.css';
import { Button, TextField } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

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
  const [deleteAppointment, { loading: deleteAppointmentLoading }] = useMutation(DELETE_APPOINTMENT);

  const { loading, error, data, refetch } = useQuery(GET_PROFESSOR_SCHEDULE, {
    variables: { profId: PID },
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const schedule = data.getProfessorsAppointments;

  function handleCancelAppointment(professorId, scheduleId) {
    deleteAppointment({
      variables: { professorId, scheduleId },
      refetchQueries: [{ query: GET_PROFESSOR_SCHEDULE, variables: { profId: PID } }]
    });
  }

  /**
   *  takes in time from database and formates it to for the user
   * @param {*} time 
   * @returns 
   */
  function returnNiceTime(time) {
    const [dateString, timeString] = time.split(' ');
    const date = new Date(dateString);
    date.setHours(parseInt(timeString) - 4)
    const options = { month: 'long', day: 'numeric', ordinal: 'numeric' };
    const displayDateTime = date.toLocaleDateString('en-us', options) + ", " + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return displayDateTime;
  }

  return (
    <>
      {deleteAppointmentLoading ?
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        :

        schedule.length === 0 ?
          <span className='noAppointmentMessage'>Appointment has not been Set</span>
          :
          <table style={{ color: 'white' }} className="profAppTable">
            <tbody className='profBodyTable'>
              {schedule.map((s) => (
                <tr style={{ color: 'black' }} key={s._id} className="appointTr">
                  <td>
                    <div className='Appointment'>
                      <div>
                        {"Appointment: "}<br />
                        {returnNiceTime(s.time)}
                      </div>
                      <div className='profData'>
                        {"Location: "}<br />
                        {s.room}
                      </div>
                      <div className='profData'>
                        {"Group: " + s.groupNumber}<br />
                        {s.groupName + " "}
                      </div>
                      <div className='profDel'>
                        <Button variant="contained" color="secondary" style={{ backgroundColor: "red" }} onClick={() => handleCancelAppointment(PID, s._id)}>
                          Cancel Meeting
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      }
    </>
  );
};