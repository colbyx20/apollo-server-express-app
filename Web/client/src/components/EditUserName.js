import React, { useState } from 'react';
import { TextField, Button} from '@mui/material';
import '../components/css/editaccout.css'

function EditUsernamePopup(props) {
  const [newUsername, setNewUsername] = useState('');

  const handleInputChange = (event) => {
    setNewUsername(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onClose();
    // call function to update username with newUsername value
  };


  return (
    <div className="popup">
      <div className="popup-inner">
        <h2 className='popUpTitle'>Edit Username</h2>
        <form onSubmit={handleSubmit}>
          <TextField
          autoFocus
          margin="dense"
          id="username"
          label="New Username"
          type="text"
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
          value={newUsername}
          onChange={handleInputChange}
        />
          <Button variant="contained" color="primary" type="submit"
          style={{width: "75%",margin: "auto", marginTop: '4px',display: "flex", alignItems: "center"}}>Submit</Button>
          <button className='close-btn' type="button" onClick={props.onClose}>
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUsernamePopup;
