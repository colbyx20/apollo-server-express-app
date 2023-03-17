import { gql, useQuery } from '@apollo/client';
import './css/getgroups.css';


const GET_MEMBERS = gql`
    query Query( $studentId: String) {
        getGroupMembers( studentId: $studentId) {
            _id
            coordinatorId
            groupName
            groupNumber
            members {
            _id
            role
            userFName
            userLName
            }
        }
    }
`

export const GetGroupMembers = ({ SID }) => {

    const { loading, error, data } = useQuery(GET_MEMBERS, {
        variables: { studentId: SID },
    })
    console.log(data);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`
    const myData = data.getGroupMembers
    // console.log(data.getGroupMembers);
    console.log("My Data");
    console.log(myData);
    return (
        <table>
            <tbody>
                <tr key={myData._id}>
                    <td style={{ border: "2px solid black" }}>Group Name: {myData.groupName}</td>
                </tr>
                <tr>
                    <td style={{ border: "2px solid black" }}>Group Number: {myData.groupNumber}</td>
                </tr>
                <table>
                    <tbody>
                        <tr >
                            <td style={{ border: "2px solid black" }}>User: {myData.members.map((member) => {
                                return (<tr>{member.userFName + " " + member.userLName + " - " + member.role}</tr>)
                            })}</td>
                        </tr>
                    </tbody>
                </table>
            </tbody>
        </table >
    )
}