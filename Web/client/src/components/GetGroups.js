import {gql, useQuery} from '@apollo/client';
import {useState} from 'react';

const GET_GROUPS = gql`
    query GetAllGroups {
        getAllGroups {
            groupName
            groupNumber
            projectField
        }
    }
`

const getFilteredData = (query, items) =>{
    if(!query){
        return items;
    }
    return items.filter(group => group.groupName.includes(query))
}

export const GetGroups = (props) => {

    const [query, setQuery] = useState("");
    const {loading, error, data} = useQuery(GET_GROUPS);

    if(loading) return 'Loading...';
    if(error) return `Error! ${error.message}`

    const {getAllGroups} = data;
    console.log(getAllGroups);

    const filterItems = getFilteredData(query,getAllGroups);

    return(
        <table className="coordiantorGroups">
            <thead>
                <tr>
                    <th style={{color:"white", paddingRight:"20px", paddingBottom:"5px"}}>Group Number</th>
                    <th style={{color:"white", paddingRight:"20px", paddingBottom:"5px"}}>Group Name</th>
                    <th style={{color:"white", paddingRight:"20px", paddingBottom:"5px"}}>Field</th>
                </tr>
                <tr>
                    <label>Search</label>
                    <input type="text" onChange={e => setQuery(e.target.value) } />
                </tr>
            </thead>

            {/* <ul>
                {filterItems.map(value => <h1 key={value.groupNumber}>{value.groupName}</h1>)}
            </ul> */}

            <tbody>
                {data.getAllGroups.filter((item) =>{
                    return query.toLowerCase() === '' ? item : item.groupName.toLowerCase().includes(query);
                }).map((group) =>{
                    return(
                        <tr key={group.groupNumber}>
                        <td style={{color:"white", paddingRight:"20px", paddingBottom:"5px"}}>Group: {group.groupNumber}</td>
                        <td style={{color:"white", paddingRight:"20px", paddingBottom:"5px"}}>{group.groupName}</td>
                        <td style={{color:"white", paddingRight:"20px", paddingBottom:"5px"}}>{group.projectField}</td>
                    </tr> 
                    )
                })}
            </tbody>
            
        </table>
    )

}
