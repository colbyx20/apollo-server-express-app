import {gql, useQuery} from '@apollo/client';

const GET_GROUPS = gql`
    query GetAllGroups {
        getAllGroups {
            groupName
            groupNumber
            projectField
        }
    }
`

export const GetGroups = (props) => {

    const {loading, error, data} = useQuery(GET_GROUPS);

    if(loading) return 'Loading...';
    if(error) return `Error! ${error.message}`

    return(
        <table className="coordiantorGroups">
            <thead>
                <tr>
                    <th style={{color:"white", paddingRight:"20px", paddingBottom:"5px"}}>Group Number</th>
                    <th style={{color:"white", paddingRight:"20px", paddingBottom:"5px"}}>Group Name</th>
                    <th style={{color:"white", paddingRight:"20px", paddingBottom:"5px"}}>Field</th>
                </tr>
            </thead>

            <tbody>
                {data.getAllGroups.map((group) =>{
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
