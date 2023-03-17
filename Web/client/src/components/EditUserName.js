import React, { useState } from 'react';
import { TextField, Button} from '@mui/material';
import '../components/css/editaccout.css'

function EditUsernamePopup(props) {
  const [newEmail, setNewEmail] = useState('');

  const handleInputChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onClose();
    // call function to update username with newUsername value
  };


  return (
    <div className="popup">
      <div className="popup-inner">
        <h2 className='popUpTitle'>Edit Email</h2>
        <form onSubmit={handleSubmit}>
          <TextField
          autoFocus
          margin="dense"
          id="email"
          label="New Email"
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
          value={newEmail}
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
