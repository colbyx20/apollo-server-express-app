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
  '9/11/12: monday',
  '8/2/22 1',
  '9/11/12 2: monday',
  '8/2/22 3',
  '9/11/12 4: monday',
  '8/2/22 5',
];

export default function TimeSelectDisplay(){

    const [personName, setPersonName] = useState([]);

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setPersonName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
    };

  return (
    <div className='selectSize'>
      <FormControl 
      sx={{ 
        m: 1, width: 300, 
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
        color: 'white',
        '&:focus-within .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'white'},
        '&:focus-within .MuiInputLabel-root': { color: 'white' } }}>
        <InputLabel sx={{ color: 'white' }} id="demo-multiple-chip-label">Days</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" sx={{ color: 'white' }}/>}
          renderValue={(selected) => (
            <Box sx={{ color:'white', display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
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
