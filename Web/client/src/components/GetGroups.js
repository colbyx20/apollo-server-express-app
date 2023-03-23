import { gql, useQuery } from '@apollo/client';
import './css/getgroups.css';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";

const GET_GROUPS = gql`
query Query($coordinatorId: String) {
    getGroupsByCoordinator(coordinatorId: $coordinatorId) {
        _id
        coordinatorId
        groupName
        groupNumber
        projectField
    }
}
`
const DELETE_GROUP= gql `
    mutation DeleteGroup($groupid:ID){
        deleteGroup(groupId:$groupid)
}
`
const getFilteredData = (query, items) => {
    if (!query) {
        return items;
    }
    return items.filter(group => group.groupName.toString().toLowerCase().includes(query.toLowerCase()) || group.groupNumber.toString().includes(query))
}

export const GetGroups = (props) => {

    const ID = localStorage.getItem('_id');

    const { loading, error, data,refetch } = useQuery(GET_GROUPS, {
        variables: { coordinatorId: ID }
    });
    
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`
    
    const search = props.data;
    const { getGroupsByCoordinator } = data;
    const filterItems = getFilteredData(search, getGroupsByCoordinator);
    const [deleteGroup] = useMutation(DELETE_GROUP,{
        refetchQueries:[{query:GET_GROUPS}]
    })
    function handleDeletion(GID){
        deleteGroup({
            variables:{groupid:GID}
        })
        console.log("done")
    }
    return (
        <>
            <div className='Sticky'>
                <h2>Design Projects</h2>
            </div>
            <table className="coordiantorGroups">

                <tbody className='coordTableItems'>
                    {filterItems.map((group) => {
                        return (
                            <tr key={group.groupNumber}>
                                <td id='rowNumber'>
                                    <div className='groupContainer'>
                                        {group.groupName} <br />
                                        Group Number: {group.groupNumber} <br />
                                        <div className='optionsContainer'>
                                            <Button size="small" sx={{backgroundColor: 'red', color: 'white'}} onClick={handleDeletion(group._id)}><DeleteIcon /></Button>
                                        </div>
                                    </div>
                                </td>
                                <td id='rowName'>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>

            </table>
        </>
    )

}
