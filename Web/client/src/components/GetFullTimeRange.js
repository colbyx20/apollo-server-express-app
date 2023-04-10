import { gql, useQuery } from '@apollo/client';
import './css/getgroups.css';

const GET_All_COORDINATOR_SCHEDULE = gql`
query Query {
  getFullTimeRange {
    _id
    times
  }
}
`
export const GetFullTimeRange = (props) => {

    const { data, loading, error } = useQuery(GET_All_COORDINATOR_SCHEDULE)

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`

    return data.getFullTimeRange[0].times
}