import { useContext, useEffect, useState } from 'react';
// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext';
import { useForm } from "../utility/hooks";
import { useMutation } from "@apollo/react-hooks";
import { gql } from 'graphql-tag';
import { TextField, Button, Container, Stack, Alert, Checkbox, FormControlLabel, withTheme } from "@mui/material";
import { blue } from '@mui/material/colors';
import "../components/css/login.css";
import logo from '../components/images/sdsLogo.png';
import Slider from '../components/Slider'

const FORGOT_PASSWORD = gql`
    mutation Mutation($email: String) {
    forgotPassword(email: $email)
    }
`


function Forgot(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState([]);
    const [checked, setChecked] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [forgotPassword] = useMutation(FORGOT_PASSWORD);

    // Get checkbox state
    useEffect(() => {
        const data = window.localStorage.getItem('checkbox')
        if (data !== null) setChecked(JSON.parse(data))
    }, [])

    // Save checkbox state
    useEffect(() => {
        window.localStorage.setItem('checkbox', JSON.stringify(checked))
    }, [checked])


    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    const STUDENT_EMAIL = new RegExp('^[a-z0-9](\.?[a-z0-9]){2,}@k(nights)?nights\.ucf\.edu$');
    const PROFESSOR_EMAIL = new RegExp('^[a-z0-9](\.?[a-z0-9]){2,}@ucf\.com$');




    const onChange = () => {

    }

    const onSubmit = () => {

    }

    function sendEmail() {
        forgotPassword({
            variables: { email: emailInput.toLowerCase() }
        })
    }

    return (

        // coding front end part 
        <div className='webPage'>
            <div className='loginContainer'>
                <Container>
                    <img src={logo} alt="Senior Design Schedular Logo"></img>
                    <h3>Forgot Password</h3>
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
                            onChange={(e) => setEmailInput(e.target.value)}
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
                    }} variant="contained" onClick={() => sendEmail()}>Confirm</Button>
                    <br />
                    <span><a href='/'>Have a login?</a></span>
                </Container>
            </div>
            <div className='imageContainer'>
                <Slider>
                </Slider>
            </div>
        </div >

    )
}

export default Forgot;