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

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`
    const myData = data.getGroupMembers

    return (
        <div className='group-container'>
            <div className='group-heading'>
                <h3 className='group-title'>{myData.groupName}</h3>
                <h3 className='group-title'>Group: {myData.groupNumber}</h3>
            </div>
            <table className='group-table'>
                <tbody>
                    <tr>
                        <td className='group-members'>{myData.members.map((member) => {
                            return (<h4 className='members' key={member._id}>{member.userFName + " " + member.userLName + " - " + member.role}</h4>)
                        })}</td>
                    </tr>
                </tbody>
            </table >
        </div>
    )
}