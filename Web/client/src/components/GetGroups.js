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
        <table className="coordiantorGroups">
            <thead>
                <tr className='coordTableHeading'>
                    <th id='topBar'>Design Projects</th>
                    <th id='topBar'>Options</th>
                </tr>
            </thead>


            <tbody className='coordTableItems'>
                {filterItems.map((group) => {
                    return (
                        <tr key={group.groupNumber}>
                            <td id='rowNumber'>
                                <div className='groupContainer'>
                                    {group.groupName} <br />
                                    Group Number: {group.groupNumber} <br />
                                    {/* Field: {group.projectField} */}
                                </div>
                            </td>
                            <td id='rowName'>
                                <div className='optionsContainer'>
                                    <button id='edit'>Edit</button>
                                    <button id='delete'>Del</button>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>

        </table>
    )

}
