import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { gql } from 'graphql-tag';
const RESET_PASSWORD = gql`
    mutation Mutation($resetPassword: resetPassword) {
        resetPassword(resetPassword: $resetPassword)
    }
`
function PasswordChangeModal(props) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleOldPasswordChange = (event) => {
        setOldPassword(event.target.value);
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };
    const resetPassword = useMutation(RESET_PASSWORD,{
        variables:
        {
            resetPassword:
            {
                email:localStorage.getItem("email"),
                password:newPassword,
                confirmPassword:newPassword
            }
        }
    });
    const handleSubmit = (event) => {
        event.preventDefault();

        if (newPassword === confirmPassword) {
        props.handlePasswordChangeSubmit(oldPassword, newPassword);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        // Add if statment to check if old password is correct
        props.handleClose();
        } else {
        setError('Passwords do not match');
        }
    };

  const isInputValid = oldPassword !== '' && newPassword !== '' && newPassword === confirmPassword;


  return (
    <div className="popup">
         <div className="popupPass-inner">
            <form onSubmit={handleSubmit}>
            <h2 className="popUpTitle">Change Password</h2>

            <TextField
                autoFocus
                margin="dense"
                id="old-password"
                label="Old Password"
                type="password"
                fullWidth
                style={{ width: "75%",  margin: "auto",
                display: "flex",
                alignItems: "center"}}
                sx={{
                    color: "#D0A300", // Set the text color
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#000", // Set the outline color
                    },
                    "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#000", // Set the outline color on focus
                    },
                }}
                InputLabelProps={{ className: 'editLabel' }}
                value={oldPassword}
                onChange={handleOldPasswordChange}
            />
            <br/>

            <TextField
                margin="dense"
                id="new-password"
                label="New Password"
                type="password"
                fullWidth
                style={{ width: "75%",  margin: "auto",
                display: "flex",
                alignItems: "center"}}
                sx={{
                    color: "#D0A300", // Set the text color
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#000", // Set the outline color
                    },
                    "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#000", // Set the outline color on focus
                    },
                }}
                InputLabelProps={{ className: 'editLabel' }}
                value={newPassword}
                onChange={handleNewPasswordChange}
            />
            <br/>

            <TextField
                margin="dense"
                id="confirm-password"
                label="Confirm Password"
                type="password"
                fullWidth
                style={{ width: "75%",  margin: "auto",
                display: "flex",
                alignItems: "center"}}
                sx={{
                    color: "#D0A300", // Set the text color
                    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#000", // Set the outline color
                    },
                    "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#000", // Set the outline color on focus
                    },
                }}
                InputLabelProps={{ className: 'editLabel' }}
                value={confirmPassword}
                error={!isInputValid}
                helperText={!isInputValid ? "Passwords do not match!" : ""}
                onChange={handleConfirmPasswordChange}
            />

            <Button variant="contained" color="primary" type="submit"
            style={{width: "75%",margin: "auto", marginTop: '4px',display: "flex", alignItems: "center"}}
            disabled={!isInputValid}>Submit</Button>
            <button className='close-btn' type="button" onClick={props.handleClose}></button>
        </form>
    </div>
  </div>
  );
}

export default PasswordChangeModal;
