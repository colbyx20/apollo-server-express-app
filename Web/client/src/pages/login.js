import { useContext, useEffect, useState } from 'react';
// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext';
import { useForm } from "../utility/hooks";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from 'graphql-tag';
import { TextField, Button, Container, Stack, Alert, Checkbox, FormControlLabel, withTheme } from "@mui/material";
import { blue } from '@mui/material/colors';
import "../components/css/login.css";
import logo from '../components/images/sdsLogo.png';
import Slider from '../components/Slider'

const LOGIN_USER = gql`
    mutation Mutation($loginInput: loginInput) {
        loginUser(loginInput: $loginInput) {
            _id
            firstname
            lastname
            email
            token 
            privilege
            image
        }
    }
`

function Login(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState([]);
    const [checked, setChecked] = useState(false);
    const [log, setLog] = useState("");

    // Get Log from local storage
    useEffect(() =>{
        const saved = window.localStorage.getItem('...')
        const initialValue = JSON.parse(saved);
        setLog(initialValue);
    }, []);

    // Get checkbox state
    useEffect(() => {
        const data = window.localStorage.getItem('checkbox')
        if (data !== null) setChecked(JSON.parse(data))
        if (JSON.parse(data) === false) window.localStorage.clear();   
    }, [])

    // Save checkbox state
    useEffect(() => {
        window.localStorage.setItem('checkbox', JSON.stringify(checked));

    }, [checked])


    const handleChange = (event) => {
        setChecked(event.target.checked);
    };


    function loginUserCallback() {
        loginUser();
    }

    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        email: "",
        password: ""
    });

    const [loginUser] = useMutation(LOGIN_USER, {
        update(proxy, { data: { loginUser: userData } }) {
            context.login(userData)
            if (checked === true){
                window.localStorage.setItem('...', JSON.stringify(userData.email));
            } 

            if (userData.privilege === 'student') {
                window.location.href = '/student';
            } else if (userData.privilege === 'coordinator') {
                window.location.href = '/coordinator';
            } else if (userData.privilege === 'professor') {
                window.location.href = '/professor'
            } else {
                console.log("User doesn't exist");
            }
        },
        onError({ graphQLErrors }) {
            setErrors(graphQLErrors);
        },
        variables: { loginInput: values }
    });

    console.log(log)

    return (

        // coding front end part 
        <div className='webPage'>
            <div className='loginContainer'>
                <Container>
                    <img src={logo} alt="Senior Design Schedular Logo"></img>
                    <h3>Login</h3>

                    <Button sx={
                        {
                            backgroundColor: 'red',
                            marginBottom: '8%',
                            marginRight: 'auto',
                            marginLeft: 'auto',
                            display: 'block',
                        }}
                        variant="contained">MyUCF coming soon</Button>

                    <Stack spacing={2} paddingBottom={2}>
                        <TextField sx={{
                            input: { color: 'white' },

                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'yellow',
                                },
                            },

                        }}
                            InputLabelProps={{ className: 'mylabel' }}
                            label="Email"
                            name="email"
                            defaultValue={log}
                            onChange={onChange}
                        />
                        <TextField sx={{
                            input: { color: 'white' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'yellow',
                                },
                            },
                        }}
                            InputLabelProps={{ className: 'mylabel' }}
                            type="password"
                            label="Password"
                            name="password"
                            onChange={onChange}
                        />
                    </Stack>
                    {errors.map(function (error) {
                        return (
                            <Alert severity="error">
                                {error.message}
                            </Alert>
                        )
                    })}
                    <Button sx={{
                        display: 'block',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        marginBottom: '5%',
                        width: '100%',
                    }} variant="contained" onClick={onSubmit}>Login</Button>
                    <FormControlLabel control={
                        <Checkbox
                            id='rememberCheck'
                            checked={checked}
                            onChange={handleChange}
                            sx={{
                                color: 'white',
                                '&.Mui-checked': {
                                    color: blue[500],
                                },
                            }}
                        />} label="Remember Email" />

                    <span><a href='/forgot'>  Forgot password?</a></span>


                </Container>
            </div>
            <div className='imageContainer'>
                <Slider>
                </Slider>
            </div>
        </div>

    )
}

export default Login;