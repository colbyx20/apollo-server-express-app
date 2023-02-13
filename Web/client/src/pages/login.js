import {useContext, useState} from 'react';
// When register is created, we needto call AuthProvider function
import { AuthContext } from '../context/authContext'; 
import {useForm} from "../utility/hooks";
import {useLazyQuery, useMutation} from "@apollo/react-hooks";
import {gql} from 'graphql-tag';
import { useNavigate } from 'react-router-dom';
import {TextField, Button, Container, Stack, Alert, withTheme} from "@mui/material";
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
        }
    }
`

function Login(props){
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState([]);

    const STUDENT_EMAIL = new RegExp('^[a-z0-9](\.?[a-z0-9]){2,}@k(nights)?nights\.ucf\.edu$');


    function loginUserCallback(){
        loginUser();
    }

    const {onChange, onSubmit, values} = useForm(loginUserCallback,{
        email:"",
        password:""
    });

    const [loginUser]  = useMutation(LOGIN_USER,{
        update(proxy,{data:{loginUser: userData}}){
            context.login(userData)
            localStorage.setItem("firstname",userData.firstname);
            localStorage.setItem("lastname",userData.lastname)
            
            if(STUDENT_EMAIL.test(userData.email)){
                // go to student page 
                 window.location.href = '/student';
                //navigate('/student');
            }else if(!STUDENT_EMAIL.test(userData.email)){
                // go to professor page 
                window.location.href = '/professor';
            }
        },
        onError({graphQLErrors}){
            setErrors(graphQLErrors);
        },
        variables:{loginInput:values}
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
                        <TextField sx={{
                            input: { color: 'white' } ,
                           
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'yellow',},
                            },
                            
                        }}
                            InputLabelProps={{className: 'mylabel'}}
                            label = "Email" 
                            name = "email"
                            onChange={onChange}
                        />
                        <TextField sx={{
                            input: { color: 'white' } ,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: 'white',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'yellow',},
                            },
                        }} 
                            InputLabelProps={{className: 'mylabel'}}
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
                        marginBottom: '5%',
                        width: '100%',
                    }}variant="contained" onClick={onSubmit}>Login</Button>

                    <span>New to SDS?<a href='/register'> Sign Up</a><br/></span>
                    <span><a href='/'>Forgot password?</a></span>
                    

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