import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export const Refresh = ({ id, privilege }) => {

    const { user } = useContext(AuthContext);


    const CHECK_AUTH = gql`
        query RefreshToken($id: ID!, $privilege: String) {
        refreshToken(id: $id, privilege: $privilege) {
        }
    }
    `

    const [errors, setErrors] = useState([]);

    const { data } = useQuery(CHECK_AUTH, {
        // update(proxy,{data:{id, privilege}}){
        //     localStorage.setItem("token",data);

        // },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
        variables: { id: id, privilege: privilege }
    });

    //  if(loading) return 'Loading...';
    //  if(error) return `Error! ${error.message}`

    return (
        <>
            <h1>{data}</h1>
            <h1>{errors}</h1>
        </>
    )





}