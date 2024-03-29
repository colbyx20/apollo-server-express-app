import { gql, useQuery } from '@apollo/client';
import './css/getgroups.css';

const GET_TIME_RANGE = gql`
    query Query($cid: String!) {
        getCoordinatorTimeRange(CID: $cid)
        }
`

export const GetCoordinatorTimeRange = ({ ID }) => {

    const { loading, error, data } = useQuery(GET_TIME_RANGE, {
        variables: { cid: ID }
    })


    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`
    const { getCoordinatorTimeRange } = data;
    return getCoordinatorTimeRange;
}