import { gql, useQuery } from '@apollo/client';
import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import './css/getgroups.css';

const GET_USER = gql`
    query GetUserInfo($id: String!) {
        getUserInfo(ID: $id) {
            email
            notificationEmail
            userId
        }
    }
`

export const GetUserInfo = (props) => {
    const { user } = useContext(AuthContext);

    const { loading, error, data } = useQuery(GET_USER, {
        variables: { id: user.id }
    })

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`

    console.log(data);

    return (
        <div>
            <p className='user-data'>Name: {user.firstname} {user.lastname}</p>
            <p className='user-data'>Account Email: {data.getUserInfo.email}</p>
            <p className='user-data'>Notification Email:{data.getUserInfo.notificationEmail}</p>
        </div>
    )
}