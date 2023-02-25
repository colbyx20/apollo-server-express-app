import jwtDecode from 'jwt-decode';
import React,{useReducer, createContext} from 'react';
import {Refresh} from '../components/Refresh';
// import {gql, useQuery} from '@apollo/client';

// const CHECK_AUTH = gql`
//     query RefreshToken($id: ID!, $token: String, $privilege: String) {
//     refreshToken(ID: $id, token: $token, privilege: $privilege) {
//         token
//     }
// }
// `

// initial state when logged out or enter website
const initialState = {
    user:null
}


// if a token lives in local storage, get that token
if(localStorage.getItem("token")){
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    // check Auth expiration -- if expired, remove token
    if (decodedToken.exp * 1000 < Date.now()){
        // call api to check if current api data == refresh token in DB.
        // If so we want to create a new access token.


        <Refresh prop={localStorage.getItem("token")} />

        // replace token??
        localStorage.removeItem("token");




    }else{
        initialState.user = decodedToken;
    }
}

const AuthContext = createContext({
    user: null,
    login: (userData) =>{},
    logout: () => {}
});

function authReducer(state,action){
    switch(action.type){
        case 'LOGIN':
            return{
                ...state,
                user:action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user:null
            }
        default:
            return state;
    }
}


function AuthProvider(props){
    const[state, dispatch] = useReducer(authReducer, initialState);
    
    const login = (userData) => {
        
        localStorage.setItem("token",userData.token);
        
        dispatch({
            type:'LOGIN',
            payload: userData
        })
    }

    function logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("firstname");
        localStorage.removeItem("lastname");

        dispatch({type:'LOGOUT'});
    }

    return (
        <AuthContext.Provider
            value={{user:state.user, login, logout}}
            {...props}
        />
    )
}

export {AuthContext, AuthProvider};
