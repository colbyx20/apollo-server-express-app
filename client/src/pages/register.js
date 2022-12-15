import {useContext, useState} from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import {useForm} from "../utility/hooks";
import {useMutation} from "@apollo/react-hooks";
import {gql} from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import {TextField, Button, Container, Stack, Alert} from "@mui/material";


const REGISTER_USER = gql`
    mutation Mutation($registerInput: RegisterInput) {
        registerUser(registerInput: $registerInput) {
            firstname
            lastname
            email
            login
            password
  }
}

`

function Register(props){

    const context = useContext(AuthContext);
    let navigate = useNavigate();
    const [errors, setErrors] = useState([]);

    function registerUserCallback(){
        console.log("callback hit");
        registerUser(); // call Reigster User API
    }

    const{onChange,onSubmit,values} = useForm(registerUserCallback, {
        firstname: "",
        lastname:"",
        login: "",
        email: "",
        password: ""
    })


    const [registerUser, {loading}] = useMutation(REGISTER_USER, {
        update(proxy,{data:{registerUser: userData}}){
            context.login(userData);
            navigate('/');
        },
        onError({graphQLErrors}){
            setErrors(graphQLErrors);
        },
        variables:{registerInput:values}
    });

    return(
        // coding front end part 
        <Container spacing={2} maxWidth="sm">
            <h3>Reigster</h3>
            <p>This is the register page, register bewlow to create an account</p>
            <Stack spacing={2} paddingBottom={2}>
                <TextField
                    label="First Name"
                    name="firstname"
                    onChange={onChange}
                />

                <TextField
                    label="Last Name"
                    name="lastname"
                    onChange={onChange}
                />
                <TextField
                    label="Email"
                    name="email"
                    onChange={onChange}
                />
                <TextField
                    label="Login"
                    name="login"
                    onChange={onChange}
                />
                <TextField
                    label="Password"
                    name="password"
                    onChange={onChange}
                />
                {/* <TextField
                    label="Confirm Password"
                    name="confirmpassword"
                    onChange={onChange}
                /> */}
            </Stack>
            {errors.map(function(error){
                return(
                    <Alert severity="error">
                        {error.message}
                    </Alert>
                )
            })}
            <Button variant="contained" onClick={onSubmit}>Register</Button>
        </Container>


    )
}

export default Register;

