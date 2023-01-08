import {useContext, useState} from 'react';
// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import {useForm} from "../utility/hooks";
import {useMutation} from "@apollo/react-hooks";
import {gql} from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import {TextField, Button, Container, Stack, Alert, withTheme} from "@mui/material";
import "../components/css/login.css";
import logo from '../components/images/sdsLogo.png';


const LOGIN_USER = gql`

    mutation Mutation($loginInput: loginInput) {
        loginUser(loginInput: $loginInput) {
            email 
            login
            firstname
            lastname
            token
        }
    }

`

function Login(props){
    let navigate = useNavigate();
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState([]);

    const STUDENT_EMAIL = new RegExp('^[a-z0-9](\.?[a-z0-9]){3,}@k(nights)?nights\.ucf\.edu$');
    const PROFESSOR_EMAIL = new RegExp('^[a-z0-9](\.?[a-z0-9]){3,}@ucf\.edu$');
    const PROFESSOR_EMAIL_TEST = new RegExp('^[a-z0-9](\.?[a-z0-9]){3,}@gmail\.com$');

    function loginUserCallback(){
        loginUser();
    }

    const {onChange, onSubmit, values} = useForm(loginUserCallback,{
        email:"",
        password:""
    });

    const [loginUser, {loading}]  = useMutation(LOGIN_USER,{
        update(proxy,{data:{loginUser: userData}}){
            
            if(STUDENT_EMAIL.test(userData.email)){
                // go to student page 
                window.location.href = '/student';
            }else if(PROFESSOR_EMAIL_TEST.test(userData.email)){
                // go to professor page 
                navigate('/');
            }
        },
        onError({graphQLErrors}){
            setErrors(graphQLErrors);
        },
        variables:{loginInput:values}
    });

    const sliderSettings = ({
        autoplay: true
    });
    
    return(
        
        // coding front end part 
        <div className='webPage'>
            <div className='loginContainer'>
                <Container>
                    <img src={logo} alt="Senior Design Schedular Logo"></img>
                    <h3>Login</h3>

                    <Button sx={
                        {backgroundColor: 'red',
                        marginBottom: '8%',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        display: 'block',
                        }} 
                    variant="contained">MyUCF coming soon</Button>

                    <Stack spacing={2} paddingBottom={2}>
                        <TextField InputLabelProps={{className: 'mylabel'}}
                            label = "Email" 
                            name = "email"
                            onChange={onChange}
                        />
                        <TextField InputLabelProps={{className: 'mylabel'}}
                            type="password"
                            label="Password"
                            name="password"
                            onChange={onChange}
                        />
                    </Stack>
                    {errors.map(function(error){
                        return(
                            <Alert severity="error">
                                {error.message}
                            </Alert>
                        )
                    })}
                    <Button sx={{
                        display: 'block',
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        width: '99%',
                    }}variant="contained" onClick={onSubmit}>Login</Button>
                </Container>
            </div>
            <div className='imageContainer'>
                    
            </div>
        </div>

        


    )
}

export default Login;