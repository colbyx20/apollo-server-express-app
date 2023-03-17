import { gql, useQuery } from '@apollo/client';
import './css/getgroups.css';

const GET_GROUPS = gql`
    query GetAllGroups {
        getAllGroups {
            groupName
            groupNumber
            projectField
        }
    }
`

const getFilteredData = (query, items) => {
    if (!query) {
        return items;
    }
    return items.filter(group => group.groupName.toString().toLowerCase().includes(query.toLowerCase()) || group.groupNumber.toString().includes(query))
}

export const GetGroups = (props) => {

    const { loading, error, data } = useQuery(GET_GROUPS);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`

    const search = props.data;
    const { getAllGroups } = data;
    const filterItems = getFilteredData(search, getAllGroups);


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
                                    <button id='edit'>Edit</button>
                                    <button id='delete'>Del</button>
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
