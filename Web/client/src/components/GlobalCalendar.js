import {useState, useEffect} from 'react';
import { TextField, Badge} from '@mui/material';
import { LocalizationProvider, DatePicker , PickersDay} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker, Ca } from '@mui/x-date-pickers/StaticDatePicker';
import '../components/css/calendar2.css'
import dayjs from 'dayjs';

const GlobalCalendar = (props) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [highlightedDays, setHighlightedDays] = useState(props.daysList);

    useEffect(() => {
      setHighlightedDays(props.daysList);
    }, [props.daysList]);

    const shouldDisableDate = (date) => {
        const day = dayjs(date).day();
        return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    };

    function checkIfExists(date){
      
      for(let i = 0; i<highlightedDays.length; i++){
        if(highlightedDays[i].getMonth() != date.getMonth())
          continue;

        if(highlightedDays[i].getMonth() === date.getMonth() && 
        highlightedDays[i].getDate() === date.getDate()){
            return true;
        }
            
      }
      return false;
    }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        minDate={props.minDate}
        maxDate={props.maxDate}
        shouldDisableDate={shouldDisableDate}
        displayStaticWrapperAs="desktop"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        renderInput={(props) => null}
        renderDay={(day, _value, DayComponentProps) => {
          const date = new Date(day);
          date.setHours(0, 0, 0, 0);
          const isSelected = checkIfExists(date);
          return (
                <Badge
                    key={day.toString()}
                    overlap="circular"
                    badgeContent={isSelected ? '🌚' : undefined}
                >
                    <PickersDay {...DayComponentProps} />
                </Badge>
                );
            }}
        
      />
    </LocalizationProvider>
  );
};

export default GlobalCalendar;
