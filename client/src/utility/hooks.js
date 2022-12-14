
// custom react hook that makes forms easier to use..

import {useState} from 'react';

export const useForm = (callback, initiateState={}) => {
    const [values, setValues] = useState(initialState);

    const onChange = (event) => {
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