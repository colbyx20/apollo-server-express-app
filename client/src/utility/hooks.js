
// custom react hook that makes forms easier to use..

import {useState} from 'react';

export const useForm = (callback, initialState={}) => {

    // if we have a pass word and email
    // {"password":"", "email" : ""}
    // when password or email gets change, set to empty string


    const [values, setValues] = useState(initialState);

    const onChange = (event) => {
        // takes values inputed and assign to password and email
        setValues({...values, [event.target.name]: event.target.value}); 
        console.log(values);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        callback(); 
    }

    return{
        onChange,
        onSubmit,
        values
    }
}