import {useContext, useState, useRef, useEffect} from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate} from 'react-router-dom'; 
import CustomSidebar from '../components/Sidebar';
import dayjs from 'dayjs';
import { add } from 'date-fns';
import GlobalCalendar from '../components/GlobalCalendar';
import {Button, Badge, TextField, Typography} from "@mui/material";
import { LocalizationProvider, DatePicker, PickersDay} from '@mui/x-date-pickers';
import { CalendarPickerSkeleton } from '@mui/x-date-pickers/CalendarPickerSkeleton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "../components/css/calendar2.css"

function Calendar(props){
    const requestAbortController = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [secondPickerEnabled, setSecondPickerEnabled] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [highlightedDays, setHighlightedDays] = useState([0]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const initialValue = dayjs(currentDate);
    const [value, setValue] = useState(initialValue);
    const [endValue, setEndValue] = useState(null);
    const maxDate = add(new Date(), { months: 2 });


    // user data lives in here  
    const {user, logout} = useContext(AuthContext);
    let navigate = useNavigate();

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


    const onLogout = () => {
        logout();
        navigate('/');
    }

    useEffect(() => {
        fetchHighlightedDays(initialValue);
        // abort request on unmount
        return () => requestAbortController.current?.abort();
    }, []);
    
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

    const shouldDisableDate = (date) => {
        const day = dayjs(date).day();
        return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
    };

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
      // Perform form submission logic here
      setIsSubmitted(true);
    }

    return(
        <>
        <div className='calendar2Page'>
            {user !== null?
                <>
                    <CustomSidebar/>
                    <div className='calendar2Wrapper'>
                        <div className='userInfo'>
                            <p className='accountHeader'>Calendar</p>
                        </div>
                        <div className='leftContainer'>
                            <div className='coordWeekContainer'>
                                <h2 className='calendar-Title'>Set Design Week</h2>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Start Date"
                                        minDate={currentDate}
                                        maxDate={maxDate}
                                        value={value}
                                        loading={isLoading}
                                        onChange={(newValue) => {
                                            setValue(newValue);
                                            setSecondPickerEnabled(true);
                                        }}
                                        shouldDisableDate={shouldDisableDate}
                                        onMonthChange={handleMonthChange}
                                        renderInput={(params) => <TextField {...params} />}
                                        renderLoading={() => <CalendarPickerSkeleton />}
                                        renderDay={(day, _value, DayComponentProps) => {
                                        const isSelected =
                                            !DayComponentProps.outsideCurrentMonth &&
                                            highlightedDays.indexOf(day.date()) > 0;

                                        return (
                                            <Badge>
                                            <PickersDay {...DayComponentProps} />
                                            </Badge>
                                        );
                                        }}
                                    />
                                </LocalizationProvider>
                                <br/>
                                <LocalizationProvider
                                dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="End Date"
                                        minDate={value}   
                                        maxDate={maxDate}
                                        loading={isLoading}
                                        value={endValue}
                                        onChange={(newValue) => {
                                            setEndValue(newValue);
                                            setIsValid(true);
                                        }}
                                        shouldDisableDate={shouldDisableDate}
                                        onMonthChange={handleMonthChange}
                                        renderInput={(params) => 
                                        <TextField {...params} />}
                                        renderLoading={() => <CalendarPickerSkeleton />}
                                        renderDay={(day, _value, DayComponentProps) => {
                                        const isSelected =
                                            !DayComponentProps.outsideCurrentMonth &&
                                            highlightedDays.indexOf(day.date()) > 0;

                                        return (
                                            <Badge>
                                            <PickersDay {...DayComponentProps} />
                                            </Badge>
                                        );
                                        }}
                                    />
                                </LocalizationProvider>

                                <Button variant="contained" color="primary" type="submit"
                                style={{ width: "236px", margin: "auto", marginTop: '4px', display: "flex", alignItems: "center" }}
                                disabled={!isValid}
                                onClick={handleSubmit}
                                >Submit</Button>
                                 {isSubmitted && (
                                    <Typography variant="subtitle1" color="success">
                                    Dates submitted successfully!
                                    </Typography>
                                )}
                            </div>
                            <div className='calendar-container'>
                            <h2 className='calendar-Title'>Calendar</h2>
                                <GlobalCalendar
                                minDate = {value}
                                maxDate = {maxDate}/>
                            </div>
                        </div>
                        <div className='rightContainer'>

                        </div>
                    </div>
                </>
                : 
                <>
                    <div className='noUser'>
                        <h3>No Page Found</h3>
                        <Button style={{color:'white'}}onClick={onLogout}>Redirect to Login</Button>
                    </div>
                </>
            }
        </div>
    </>
    )
}

export default Calendar;