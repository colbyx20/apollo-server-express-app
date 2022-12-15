import {Link} from 'react-router-dom';
import { AuthContext } from '../context/authContext'; 
import {useContext} from 'react';

function Homepage(){
    const {user, logout} = useContext(AuthContext);


    return(
        <>
        <h1> this is the Home Page </h1>
        {user ? 
            <>
                <h2>{user.email} is logged in</h2>
            </>
        :
            <>
                <p>There is not user Data </p>
            </>
        }
        </>
    )
}

export default Homepage;