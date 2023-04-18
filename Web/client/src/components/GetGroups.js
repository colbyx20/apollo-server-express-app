import { gql, useQuery, useMutation } from '@apollo/client';
import './css/getgroups.css';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import React, { useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";
import { AuthContext } from '../context/authContext';

export const GET_GROUPS = gql`
    query Query($coordinatorId: String) {
        getGroupsByCoordinator(coordinatorId: $coordinatorId) {
            _id
            coordinatorId
            groupName
            groupNumber
            projectField
            isSponsor
        }
    }
`

const DELETE_GROUP = gql`
    mutation Mutation($groupId: ID) {
        deleteGroup(groupId: $groupId)
    }
`
const getFilteredData = (query, items) => {
    if (!query) {
        return items;
    }
    return items.filter(group => group.groupName.toString().toLowerCase().includes(query.toLowerCase()) || group.groupNumber.toString().includes(query))
}

export const GetGroups = (props) => {
    const { user } = useContext(AuthContext);
    const [deleteGroup] = useMutation(DELETE_GROUP)

    const { loading, error, data, refetch } = useQuery(GET_GROUPS, {
        variables: { coordinatorId: user.id }
    });

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`

    const search = props.data;
    const { getGroupsByCoordinator } = data;
    const filterItems = getFilteredData(search, getGroupsByCoordinator);

    function handleDeletion(GID) {

        deleteGroup({
            variables: { groupId: GID },
            refetchQueries: [{ query: GET_GROUPS, variables: { coordinatorId: user.id } }]
        })
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
                                            <Button size="small" sx={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDeletion(group._id)}><DeleteIcon /></Button>
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
