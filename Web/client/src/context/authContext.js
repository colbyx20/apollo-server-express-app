import jwtDecode from 'jwt-decode';
import React, { useReducer, createContext } from 'react';

// initial state when logged out or enter website
const initialState = {
    user: null
}

// if a token lives in local storage, get that token
if (localStorage.getItem("token")) {
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    initialState.user = decodedToken;
}

const AuthContext = createContext({
    user: null,
    login: (userData) => { },
    logout: () => { }
});

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default:
            return state;
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = (userData) => {

        // this does nothing for some reason
        localStorage.setItem("token", userData.token);

        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    function logout() {
        localStorage.clear();

        dispatch({ type: 'LOGOUT' });
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            {...props}
        />
    )
}

export { AuthContext, AuthProvider };
