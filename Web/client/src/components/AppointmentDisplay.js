import { textAlign } from '@mui/system';
import { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function AppointmentDisplay({ date, appointment, updateTimes }) {

  const list = appointment.map((app) =>
      <Accordion className='timeslot' key={app.id}>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{app.time}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography align='left'>Available Professors:</Typography>
          <Typography>
            {app.professors.map((professor) => <Typography align='left' sx={{marginLeft: '10px'}}>{professor}</Typography>)}
          </Typography>
          <Button sx={{marginLeft: '80%'}} onClick={(newValue)=> updateTimes(app)}>Accept</Button>
        </AccordionDetails>
      </Accordion>
  );

  // const list = appointment.map((app) =>
  //   <li className='timeslot' key={app.id}>
  //     {app.time}
  //     <p style={{textAlign: 'left', marginBottom: '10px'}}>Available Professors:</p>
  //     {app.professors.map((professor) => <li key={app.id} className='profNames'>{professor}</li>)}
  //   </li>
  // );

  
  const noResults = "There are no appointments available to show at this date"

  return (
    <>
      <Typography variant='h4' className='availTimesHeader'> The available times are: </Typography>
      {Object.keys(appointment).length > 0 ? ( 
          <div> {list} </div>
        )
       : <li className='availTimesHeader'> {noResults} </li>}
    </>
  );
}