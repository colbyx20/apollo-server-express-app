import {gql, useQuery} from '@apollo/client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



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
<>
        {/* <table>
            <thead>
                <tr>
                    <th style={{color:"white"}}>Time</th>
                    <th style={{color:"white"}}>Professors</th>
                </tr>
                
            </thead>

            <tbody>
                {data.availSchedule.map((s) =>{
                    return(
                        <>
                        <tr key={s._id}>
                            <td style={{color:"white"}}>{s._id}</td>
                            <td style={{color:"white"}}>
                                {s.pId.map((e) => {
                                    return (
                                        <tr key={e._id}>
                                            <td>{e.name}</td> 
                                        </tr> 
                                    )
                                })}    
                            </td>
                        </tr>
                        <hr />
                        </>
                    )
                })}
            </tbody>



        </table> */}
        
        
        <br /> 

        <TableContainer component={Paper}  sx={{width: 600}}>
            <Table sx={{ minWidth: 600 }} size="small" aria-label="a dense table">

                <TableHead>
                    <TableRow>
                        <TableCell align="left">Time</TableCell>
                        <TableCell align='left'>Professor</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>

                {data.availSchedule.map((s) =>{
                    return(
                        <>
                        <TableRow 
                        key={s._id}
                        sx={{'&:last-child td, &:last-child th':{border:0}}}
                        >
                            <TableCell align="left">{s._id}</TableCell>
                            <TableCell align="left">
                                {s.pId.map((e) => {
                                    return (
                                        <TableCell component="tr" scope="row" key={e._id}>
                                            <TableCell align="left">{e.name}</TableCell> 
                                        </TableCell> 
                                    )
                                })}    
                            </TableCell>
                        </TableRow>
                        </>
                    )
                })}

                </TableBody>

            </Table>
        </TableContainer>
        
        
        </>
        



    )




}