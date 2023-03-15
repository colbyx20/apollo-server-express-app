import { useState } from 'react';
import dayjs from 'dayjs';
import './css/calendar.css';
import './css/schedule.css';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import WeekTimeButton from './WeekTimeButton';
import TimesAvailable from './TimesAvailable';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
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

export default function ProfCalendar() {
  const [value, setValue] = useState(dayjs(new Date()));

  const appointmentsOnThatDay = (val, app) => {
    const retVal = app.filter((date) => {
      // console.log((val.$d.toLocaleDateString() === date.date) ? "Yes" : "No")
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

  const daysArr = [
    { id: 0, data: 'Monday', selected: false },
    { id: 1, data: 'Tuesday', selected: false },
    { id: 2, data: 'Wednesday', selected: false },
    { id: 3, data: 'Thursday', selected: false },
    { id: 4, data: 'Friday', selected: false }
  ]

  const timesArr = [
    { id: 0, data: '700', selected: false},
    { id: 1, data: '800', selected: false},
    { id: 2, data: '900', selected: false},
    { id: 3, data: '1000', selected: false},
    { id: 4, data: '1100', selected: false},
    { id: 5, data: '1200', selected: false},
    { id: 6, data: '1300', selected: false},
    { id: 7, data: '1400', selected: false},
    { id: 8, data: '1500', selected: false},
    { id: 9, data: '1600', selected: false},
    { id: 10, data: '1700', selected: false},
    { id: 11, data: '1800', selected: false},
    { id: 12, data: '1900', selected: false},
    { id: 13, data: '2000', selected: false},
    { id: 14, data: '2100', selected: false},
    { id: 15, data: '2200', selected: false},
  ]

  const appointmentInfo = [
    {id: 0, day: 'Monday', times:[] },
    {id: 1, day: 'Tuesday', times:[] },
    {id: 2, day: 'Wednesday', times:[] },
    {id: 3, day: 'Thursday', times:[] },
    {id: 4, day: 'Friday', times:[] },
  ]

  // const appointmentInfo = [
  //   {id: 0, date: '', day: 'Monday', times:[] },
  //   {id: 1, date: '', day: 'Tuesday', times:[] },
  //   {id: 2, date: '', day: 'Wednesday', times:[] },
  //   {id: 3, date: '', day: 'Thursday', times:[] },
  //   {id: 4, date: '', day: 'Friday', times:[] },
  // ]

  const [days, setDays] = useState(daysArr)
  const [times, setTimes] = useState(timesArr)
  const [appAvailability, setAppAvailability] = useState(appointmentInfo)


  const dayClickEvent = (curDay) => {
    const newVal = [...days]
    const updateVal = newVal.find(
      d => d.id === curDay.id
    );
    updateVal.selected = !updateVal.selected
    setDays(newVal)
  }

  const timeClickEvent = (curTime) => {
    const newVal = [...times]
    const updateVal = newVal.find(
      t => t.id === curTime.id
    );
    updateVal.selected = !updateVal.selected
    setTimes(newVal)
  }

  // keep for now in case we need something from it later
  // const updateAppointmentAvailability = () => {
    
  //   // need this when do map so it knows which id to check for
  //   let selectedDayIdx = 0
  //   const newObj = [...appAvailability]
    
  //   const selectedDays = days.filter((curDay) => {
  //     return curDay.selected === true;
  //   })

  //   console.log(newObj)

  //   const prevTimes = newObj.map((prevTime) => {
  //     return prevTime.times
  //   })

  //   console.log(prevTimes)

  //   // get it so it will get the previous times that were selected too. not sure how. maybe filter through the appAvail times first and then add an or statement in the selectedTimes
  //   const selectedTimes = times.filter((curDay) => {
  //     return curDay.selected === true;
  //   })

  //   // const selectedTimes = times.filter((curDay) => {
  //   //   return curDay.selected === true;
  //   // }).map((curTime) => {return curTime.data})

    

  //   // don't change anything if they don't have a day selected
  //   // should probably add an error but not sure how
  //   if(selectedDays.length === 0) {
  //     return newObj
  //   }

  //   //only issue now is that when you add a new time, it doesnt keep the old one if its not selected

  //   const updatedObj = newObj.map(curDay => {
  //     // console.log(`days id is ${selectedDays[selectedDayIdx].id} curday id is ${curDay.id}`)
  //     if (curDay.id === selectedDays[selectedDayIdx].id) {
  //       if(selectedDayIdx < selectedDays.length - 1){
  //         selectedDayIdx++
  //       }
  //       console.log("Yo")
  //       return { ...curDay, times: [...selectedTimes] };
  //     } else {
  //       // No changes
  //       return curDay;
  //     }
  //   });

  //   // This sets the days and times selected back to false but doesn't update the theme state so leave out for now
  //   // maybe just have the user manually deselect the day to update times for now

  //   // setDays(daysArr)
  //   // setTimes(timesArr)

  //   setAppAvailability(updatedObj)
  //   // console.log(selectedDays)
  //   // console.log(selectedTimes)
  //   // console.log(updatedObj)
  // }

  const updateAppointmentAvailability = () => {
    
    // need this when do map so it knows which id to check for
    let selectedDayIdx = 0
    let selectedTimeIdx = -1
    let i = 0
    const newObj = [...appAvailability]
    
    const selectedDays = days.filter((curDay) => {
      return curDay.selected === true;
    })

    // don't change anything if they don't have a day selected
    // should probably add an error but not sure how
    if(selectedDays.length === 0) {
      return newObj
    }

    const prevTimes = newObj.filter((curDay) => {
      // console.log()
      if(selectedDays[i]?.id === curDay.id){
        i++
        return curDay.times
      }
    })

    const newTimes = times.filter((curTime) => {
      return curTime.selected === true;
    })

    // take the old times and add the new ones to them
    const selectedTimes = prevTimes.map((pTime) => {
      return pTime.times.concat(newTimes)
    })

    // take the times and make sure theyre in id order or you'll have like 8:00 to 7:00 which looks weird
    const sortedTimes = selectedTimes.map((curTime) => {
      curTime = curTime.filter((t, idx) => {
        return curTime.indexOf(t) === idx
      })
      return curTime.sort((a, b) => a.id - b.id)
    })

    console.log(sortedTimes)

    const updatedObj = newObj.map(curDay => {
      if (curDay.id === selectedDays[selectedDayIdx].id) {
        if(selectedDayIdx < selectedDays.length - 1){
          selectedDayIdx++
        }
        selectedTimeIdx++
        return { ...curDay, times: [...sortedTimes[selectedTimeIdx]]};
        // return { ...curDay, times: [...selectedTimes[selectedTimeIdx]]};
      } else {
        // No changes
        return curDay;
      }
    });

    setAppAvailability(updatedObj)
  }

  // deletes a single time
  const deleteSelectedAppointmentFunc = (value, valueDay) => {
    const newObj = [...appAvailability]

    const getDay = newObj.find(
      t => t.id === valueDay.id
    );
    getDay.times = getDay.times.filter((curTime) => {
      return curTime.id !== value.id
    })
    setAppAvailability(newObj)
  }

  // console.log(appAvailability)
  
  return (
    <div className="calendarMundo">
      <div>
        <div className='userInfo'>
          <p className='calendarHeader'>Calendar</p>
        </div>
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
          {/* <div className='statusDisplayWrapper'>
          </div> */}
        </div>
      </div>
      <div className='appointments'>
        <p className='appointHeader'>My Schedule</p>
        <div className='appointmentWrapper' style={{backgroundColor: 'gray'}}>
          <div className='daytimeContainer'>
            <p className='sectionHeader'>Week Days:</p>
            <div className='btn-wrapper'>
              <div className='weekday-btns'>
                {days.map((curDay) => <WeekTimeButton key={curDay.id} value={curDay} updateFunct={dayClickEvent} clsName='weekDisplay' />)}
              </div>
            </div>
          </div>
          <div className='daytimeContainer'>
            <p className='sectionHeader'>Times:</p>
            <div className='btn-wrapper'>
              <div className='time-btns'>
                {times.map((curTime) => <WeekTimeButton key={curTime.id} value={curTime} updateFunct={timeClickEvent} clsName='timeDisplay' />)}
              </div>
            </div>
          </div>
          <div className='daytimeContainer'>
            <p className='sectionHeader'>Times Available:</p>
            <div className='btn-wrapper'>
              <div className='timeAvail'>
                {appAvailability.map((curDay)=> <TimesAvailable key={curDay.id} value={curDay} deleteAppFunc={deleteSelectedAppointmentFunc} />)}
              </div>
            </div>
          </div>
          <div className='confirm-btn'>
            <button onClick={() => updateAppointmentAvailability()}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// for the days available, have all the days and then a list of the times they're available. If no times then say theres no times

// once click confirm, then times available populates if theres no appointments from api

// maybe make a state thats called an update state and have it passed ot a few states that I want updated when something changes so they rerender
// not sure if that'll work though


// const newObj = [...appAvailability]

// Note: don't use this
// // let updatedObj = []

// const updatedObj = selectedDays.map((curDay) => {
//   if(newObj.length === 0){
//     return {id: curDay.id, day: curDay.data, times: [...selectedTimes]}
//   }
//   else{
//     return [...newObj, { id: curDay.id, day: curDay.data, times: [...selectedTimes]}]
//   }
// })