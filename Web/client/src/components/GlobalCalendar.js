import {useState, useRef} from 'react';
import { TextField, Badge} from '@mui/material';
import { LocalizationProvider, DatePicker , PickersDay} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker, Ca } from '@mui/x-date-pickers/StaticDatePicker';
import '../components/css/calendar2.css'
import dayjs from 'dayjs';

const GlobalCalendar = (props) => {
    const requestAbortController = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [highlightedDays, setHighlightedDays] = useState([]);

    const shouldDisableDate = (date) => {
        fetchHighlightedDays(date)
        const day = dayjs(date).day();
        return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    };

    const fetchHighlightedDays = (date) => {
        const controller = new AbortController();
        fakeFetch(date, {
          signal: controller.signal,
        })
          .then(({ daysToHighlight }) => {
            setHighlightedDays(daysToHighlight);
            setIsLoading(false);
          })
          .catch((error) => {
            // ignore the error if it's caused by `controller.abort`
            if (error.name !== 'AbortError') {
              throw error;
            }
          });
        requestAbortController.current = controller;
    }

    function fakeFetch(date, { signal }) {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            const daysInMonth = date.daysInMonth();
            const daysToHighlight = [0, 1, 2, 3, 4, 5];
      
            resolve({ daysToHighlight });
          }, 500);
      
          signal.onabort = () => {
            clearTimeout(timeout);
            reject(new DOMException('aborted', 'AbortError'));
          };
        });
    }

    const handleMonthChange = (date) => {
        if (requestAbortController.current) {
            // make sure that you are aborting useless requests
            // because it is possible to switch between months pretty quickly
            requestAbortController.current.abort();
        }
    
        setIsLoading(true);
        setHighlightedDays([]);
        fetchHighlightedDays(date);
    };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        minDate={props.minDate}
        maxDate={props.maxDate}
        loading={isLoading}
        shouldDisableDate={shouldDisableDate}
        onMonthChange={handleMonthChange}
        displayStaticWrapperAs="desktop"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        renderInput={(props) => null}
        renderDay={(day, _value, DayComponentProps) => {
            const isSelected =
                !DayComponentProps.outsideCurrentMonth &&
                highlightedDays.indexOf(day.date()) > 0;

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
