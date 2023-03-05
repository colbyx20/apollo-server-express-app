import { textAlign } from '@mui/system';
import { useState } from 'react';
import Typography from '@mui/material/Typography';

export default function StatusDisplay({ times }) {

  const style = {marginLeft: '10%'}

  const appDisplay = <Typography align='left' sx={{marginLeft: '5%'}}>
  {times.date} at {times.time}</Typography>

  const curProf = times.professors?.map((app) =>
    <Typography align={'left'} sx={style}>{app}</Typography>
  )

  return (
    <>
      <Typography sx={{margin: '10px 0 0 0'}}>Current Appointment</Typography>
      {appDisplay}
      <Typography variant={'h6'} textAlign={'left'} sx={{margin: '0 0 0 5%'}}>Professors</Typography>
      {curProf}
    </>
  );
}