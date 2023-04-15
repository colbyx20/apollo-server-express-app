import { gql, useQuery } from '@apollo/client';
import React, { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import './css/getgroups.css';

const GET_USER = gql`
    query GetUserInfo($id: String!) {
        getUserInfo(ID: $id) {
            email
            notificationEmail
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


    return (
        <div className='myUserData'>
            <div className='user-styleBox'>
                <p className='user-dataTitle'>Name:</p>
                <p className='user-data'>{user.firstname} {user.lastname}</p>

            
                <p className='user-dataTitle'>Account Email:</p>
                <p className='user-data'>{data.getUserInfo.email}</p>
          
            
                <p className='user-dataTitle'>Notification Email:</p>
                <p className='user-data'>{data.getUserInfo.notificationEmail}</p>
            </div>


        </div>
    )
}