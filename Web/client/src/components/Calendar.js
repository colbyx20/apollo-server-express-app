import { useState } from 'react';
import dayjs from 'dayjs';
import './css/calendar.css';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { amber, purple } from '@mui/material/colors'
import Button from '@mui/material/Button';
import AppointmentDisplay from './AppointmentDisplay'
import StatusDisplay from './StatusDisplay';

const info = [
  {
    id: 1,
    date: '3/7/2023',
    time: '5:30pm',
    professors: ['THE flynecker', 'mcalpin mcalpington', 'that OneGuy']
  },
  {
    id: 2,
    date: '3/10/2023',
    time: '7:30pm',
    professors: ['pineappleBoy', 'John Cena', 'Morgan Freeman']
  },
  {
    id: 3,
    date: '3/24/2023',
    time: '9:20am',
    professors: ['Chuck Norris', 'Spongebob Squarepants', 'Patrick Star']
  },
  {
    id: 4,
    date: '3/24/2023',
    time: '9:50am',
    professors: ['Left Shark', 'Dr Lobo', 'Chef Boyardee']
  }
]

export default function Calendar() {
  const [value, setValue] = useState(dayjs(new Date()));

  const appointmentsOnThatDay = (val, app) => {
    const retVal = app.filter((date) => {
      return val.$d.toLocaleDateString() === date.date
    })
    return retVal
  }

  const [appointment, setAppointment] = useState(info)
  const [curDayApp, setCurDayApp] = useState(appointmentsOnThatDay(value, appointment))

  const [selectedTimes, setSelectedTimes] = useState([])

  const isWeekend = (date) => {
    const day = date.day();

    return day === 0 || day === 6;
  };

  const setUpdatedSelectedTimes = (newAppointment) => {
    setSelectedTimes(newAppointment)
  }

  return (
    <div className="calendarMundo">
      <div className='leftSideDisplay'>
        <div className="staticCalendar" >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              openTo="day"
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
                setCurDayApp(appointmentsOnThatDay(newValue, appointment))
              }}
              views={["day"]}
              shouldDisableDate={isWeekend}
              showDaysOutsideCurrentMonth={true}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className='statusDisplayWrapper'>
          <StatusDisplay times={selectedTimes} />
        </div>
      </div>
      <div className='appointments'>
        {curDayApp ? <AppointmentDisplay date={value.$d.toLocaleDateString()} appointment={curDayApp} updateTimes={setUpdatedSelectedTimes} /> : <AppointmentDisplay date="" appointment={curDayApp} updateTimes={setUpdatedSelectedTimes} />}
      </div>
    </div>
  );
}

// <Display date={value.$d.toLocaleDateString()} appointment={appointment} />

// NOTE
// <Display date={value.$d.toDateString()} />

// maybe have it so when the onchange is called, then it will update the display on the right
// when its changed, it will send in the component with the correct props
// if theres no matches in the info array then it will display that theres nothing to show