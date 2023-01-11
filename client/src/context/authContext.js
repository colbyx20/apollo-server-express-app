import jwtDecode from 'jwt-decode';
import React,{useReducer, createContext} from 'react';

// initial state when logged out or enter website
const initialState = {
    user:null
}

// if a token lives in local storage, get that token
if(localStorage.getItem("token")){
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    if (decodedToken.exp * 1000 < Date.now()){
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


    // this is not working idk why
    const login = (userData) => {
        localStorage.setItem("token",userData.token); // we have the correct stuff from our apollo server (this is successful repsonse)
        localStorage.setItem("firstname",userData.firstname);
        localStorage.setItem("lastname",userData.lastname);
        localStorage.setItem("email",userData.email);



        dispatch({
            type:'LOGIN',
            payload: userData
        })
    }

    function logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("firstname");
        localStorage.removeItem("lastname");
        localStorage.removeItem("email");

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
