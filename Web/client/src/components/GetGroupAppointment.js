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
    console.log(data);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`
    const myData = data.getGroupAppointment
    // console.log(data.getGroupMembers);
    console.log("My Data");
    console.log(myData);
    return (
        <table>
            <tbody>
                <tr key={myData._id}>
                    <td style={{ border: "2px solid black" }}>Time: {myData.time}</td>
                </tr>
                <tr>
                    <td style={{ border: "2px solid black" }}>Room: {myData.room}</td>
                </tr>
                <table>
                    <tbody>
                        <tr >
                            <td style={{ border: "2px solid black" }}>Attending Professors: {myData.attending2.map((member) => {
                                return (<tr key={member._id}>{member.fullName}</tr>)
                            })}</td>
                        </tr>
                    </tbody>
                </table>
            </tbody>
        </table >
    )
}