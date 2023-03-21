import {useState} from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import '../components/css/calendar2.css'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  '8:00am',
  '9:00am',
  '10:00am',
  '11:00am',
  '1:00pm',
  '2:00pm',
  '3:00pm',
  '4:00pm',
  '5:00pm',
  '6:00pm',
  '7:00pm',
  '8:00pm'
];

export default function HourSelectDisplay(props){

    const [time, setTime] = useState([]);

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setTime(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
        props.onTimeChange(typeof value === 'string' ? value.split(',') : value,);
    };

  return (
    <div className='selectSize'>
      <FormControl 
      sx={{ m: 1, width: 300}}>
        <InputLabel id="demo-multiple-chip-label">Time</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={time}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" sx={{ color: 'black' }}/>}
          renderValue={(selected) => (
            <Box sx={{ color:'white', display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} sx={{color:'black'}} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );

}
