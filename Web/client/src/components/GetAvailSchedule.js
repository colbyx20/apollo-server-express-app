import {gql, useQuery} from '@apollo/client';


const GET_AVAILABLE_SCHEDULE = gql`
    query Query{
        availSchedule
    }
`

export const GetAvailSchedule = (props) =>{

    const {loading, error, data} = useQuery(GET_AVAILABLE_SCHEDULE);

    if(loading) return 'Loading...';
    if(error) return `Error ${error.message}`

    return(

        <table>
            <thead>
                <tr style={{color:"white"}}>Time</tr>
                <tr style={{color:"white"}}>Professors</tr>
            </thead>

            <tbody>
                {data.availSchedule.map((s) =>{
                    return(
                        <tr key={s._id}>
                            <td style={{color:"white"}}>{s._id}</td>

                        </tr>
                    )
                })}
            </tbody>



        </table>




    )




}