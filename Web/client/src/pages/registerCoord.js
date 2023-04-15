import { useContext, useState } from 'react';

// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext';
import { useForm } from "../utility/hooks";
import { useMutation } from "@apollo/react-hooks";
import { gql } from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Stack, Alert, AlertTitle } from "@mui/material";
import "../components/css/register.css";
import Slider from '../components/Slider'


const REGISTER_COORDINATOR = gql`
    mutation Mutation($registerInput: RegisterInput) {
        registerCoordinator(registerInput: $registerInput) {
            firstname
            lastname
            email
            privilege
            token
  }
}

`

const textBoxStyle = {
    input: { color: 'white' },

    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'yellow',
        },
    },
}

function Register(props) {

    const context = useContext(AuthContext);
    let navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);
    function registerUserCallback() {
        console.log("callback hit");
        registerUser(); // call Reigster User API
    }

    const { onChange, onSubmit, values } = useForm(registerUserCallback, {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmpassword: "",
    })


    const [registerUser, { loading }] = useMutation(REGISTER_COORDINATOR, {
        // update(proxy, { data: { registerUser: userData } }) {
        //     context.login(userData);
        // },
        variables: { registerInput: values },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
        onCompleted() {
            setIsRegistered(true);
            setTimeout(() => {
                window.location.href = '/';
            }, 3000)
        }
    });

    return (
        // coding front end part 
        <div className='registerPage'>
            <div className='registerContainer'>
                <Container>
                    <h3>Create an account</h3>
                    <p>Welcome, complete the form to create a Senior Design Scheduler account</p>
                    <Stack spacing={2} paddingBottom={1}>
                        <TextField sx={textBoxStyle}
                            InputLabelProps={{ className: 'mylabel' }}
                            label="First Name"
                            name="firstname"
                            onChange={onChange}
                        />
                        <TextField sx={textBoxStyle}
                            InputLabelProps={{ className: 'mylabel' }}
                            label="Last Name"
                            name="lastname"
                            onChange={onChange}
                        />
                        <TextField sx={textBoxStyle}
                            InputLabelProps={{ className: 'mylabel' }}
                            label="Email"
                            name="email"
                            onChange={onChange}
                        />
                        <TextField sx={textBoxStyle}
                            InputLabelProps={{ className: 'mylabel' }}
                            type="password"
                            label="Password"
                            name="password"
                            onChange={onChange}
                        />
                        <TextField sx={textBoxStyle}
                            InputLabelProps={{ className: 'mylabel' }}
                            type="password"
                            label="Confirm Password"
                            name="confirmpassword"
                            onChange={onChange}
                        />
                    </Stack>
                    {errors.length ? (
                        <>
                            {errors.map((error) => (
                                <Alert severity="error">{error.message}</Alert>
                            ))}
                        </>
                    ) : isRegistered ? (
                        <Alert severity="success">You have successfully registered</Alert>
                    ) : null}

                    <Button sx={{
                        display: 'block',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        marginBottom: '5%',
                        width: '100%',
                    }}
                        variant="contained" onClick={onSubmit}>Register</Button>

                    <span>Have an account?<a href='/login'> Log In</a><br /></span><br />
                    <ul style={{ paddingLeft: '5px', color: 'white', listStyleType: 'none' }}>Password Rules <hr /><br />
                        <li>First character Must be Upper Case</li>
                        <li>Must be at least 8 characters long</li>
                        <li>Must contain a Number</li>
                        <li>Must contain a Special Character</li>
                    </ul>
                </Container>
            </div>
            <div className='imageContainer'>
                <Slider></Slider>
            </div>
        </div>


    )
}

export default Register;

