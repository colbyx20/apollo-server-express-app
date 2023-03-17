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

    // console.log("Data");
}