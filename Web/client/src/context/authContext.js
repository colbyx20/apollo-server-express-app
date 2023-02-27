import jwtDecode from 'jwt-decode';
import React,{useReducer, createContext} from 'react';

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
        
        
        // const getRefreshToken = async (decodedToken) =>{
            
        //     const {id, privilege} = decodedToken
        //     localStorage.setItem("SomethingHere", id);
        //     console.log(id);
        //     console.log(privilege);
        //     const graphqlQuery = {
        //     "operationName": "Query",
        //     "query":`query Query{refreshToken}`,
        //     "variables":{id, privilege}
        //     }

        //     const refreshToken = await fetch("http://localhost:8080/graphql",{
        //     method:"POST",
        //     headers:{"Content-Type":"application/json",},
        //     body: JSON.stringify(graphqlQuery),
        //     })

        //     const res = await refreshToken.json();

        //     localStorage.setItem("SomethingHere", res.data.refreshToken);
        //     console.log(res.data.refreshToken);

        
            
        // }

        // getRefreshToken();


        localStorage.clear();
        // <Refresh prop={{id, privilege}} />

        // replace token??
        window.location.href = '/';




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

        // this does nothing for some reason
        localStorage.setItem("token",userData.token);
        
        dispatch({
            type:'LOGIN',
            payload: userData
        })
    }

    function logout(){
        localStorage.clear();

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
