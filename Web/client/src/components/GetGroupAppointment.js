import { gql, useQuery } from '@apollo/client';
import './css/getgroups.css';


const GET_GROUP_APPOINTMENT = gql`
query GetGroupAppointment($studentId: String) {
    getGroupAppointment(studentId: $studentId) {
            _id
            time
            room
            numberOfAttending
            attending2 {
            _id
            fullName
            }
        }
    }
`

export const GetGroupAppointment = ({ SID }) => {

    const { loading, error, data } = useQuery(GET_GROUP_APPOINTMENT, {
        variables: { studentId: SID },
    })

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`
    const myData = data.getGroupAppointment

    return (
        <>
            {myData === null ?
                <span className='noAppointmentMessage'>Appointment has not been Set</span>
                :
                <table>
                    <tbody>
                        <tr >
                            <div className='getappInfo'>
                                {
                                    new Date(myData?.time).toLocaleDateString('en-us', { month: 'numeric' }) + "/" +
                                    new Date(myData?.time).toLocaleDateString('en-us', { day: 'numeric' }) + "/" +
                                    new Date(myData?.time).toLocaleDateString('en-us', { year: 'numeric' })
                                }<br />
                                {myData?.room}<br />
                                {new Date(myData?.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                            </div>
                            <td>Attending Professors: {myData?.attending2.map((member) => {
                                return (<tr key={member?._id}>{member?.fullName}</tr>)
                            })}</td>
                        </tr>
                    </tbody>
                </table>


            }
        </>
    )
}