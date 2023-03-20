import CalendarComp from '../components/Calendar'
import ProfCal from '../components/ProfCalendar'
import CustomSidebar from '../components/Sidebar';
import CssBaseline from '@mui/material/CssBaseline';
import { gql, useQuery } from '@apollo/client';

import { useState } from 'react';
import { ThemeProvider, createTheme, colors } from '@mui/material';
import Button from '@mui/material/Button';
import { amber, deepOrange, grey, purple, yellow } from '@mui/material/colors';

const getDesignTokens = (mode) => ({
  typography: {
    body1: {
      color: grey[900],
    },
    caption: {
      fontSize: 14,
    },
    ...(!mode && {
      body1: {
        color: grey[50],
      },
      caption: {
        fontSize: 14,
      },
    })
  },
  palette: {
    primary: {
      // ...grey[900],
      main: "#FFC904",
      dark: "#FFC904",
      
      ...(!mode && {
        main: "#FFC904",
        dark: "#FFC904",
      }),
    },
    ...(!mode && {
      background: {
        // default: "#231F20",
        // paper: "#211F20",
        paper: "#000",

      },
    }),
    text: {
      ...(mode
        ? {
          primary: grey[900],
          secondary: grey[800],
        }
        : {
          secondary: grey[500],
        }),
    },
  },
});

const GET_COORD_SCHEDULE = gql`
  query Query {
    getAllCoordinatorSchedule {
      time
      _id
      coordinatorInfo {
        _id
        coordinatorFName
        coordinatorLName
      }
    }
  }
`

export default function Calendar( { lightMode } ) {

  const { loading, error, data } = useQuery(GET_COORD_SCHEDULE);
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`


  const theme = createTheme(getDesignTokens(lightMode))
  return (
    <>
      <div className='calendarPage'>
          <CustomSidebar />
          <div className='calendarWrapper'>
            {/* <div className='userInfo'>
              <p className='calendarHeader'>Calendar</p>
            </div> */}
            <ThemeProvider theme={theme}>
                <ProfCal className="calendarComponent" data={data} />
            </ThemeProvider>
          </div>
      </div>
    </>
  );
}