import { gql, useMutation, useQuery } from '@apollo/client';
import * as React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const GET_PROFESSOR = gql`
query GetProfessor($id: ID!) {
    getProfessor(ID: $id) {
        _id
        availSchedule
    }
}
`


export const GetProfessorSchedule = () => {

    const { user } = useContext(AuthContext);
    const { loading, error, data, refetch } = useQuery(GET_PROFESSOR, {
        variables: { id: user.id }
    });

    console.log(data);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    // return (
    //     // <div>{data}</div>
    // )

}