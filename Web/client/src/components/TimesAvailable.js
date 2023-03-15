import { useState } from 'react';
import './css/calendar.css';
import './css/schedule.css';

export default function TimesAvailable({ value, deleteAppFunc }) {

  const displayTimes = value.times.map((curTime, key) => {
    return (
      <div key={key} className='times-available'>
        <p className='app-time'>{curTime.data}</p>
        <div className='delete-app'>
          <button onClick={() => deleteAppFunc(curTime, value)}>x</button>
        </div>
      </div>
    );
  })

  return (
    <div className='timeAvailableWrapper'>
      <p className='days-available'>{value.day}:</p>
      {displayTimes}
    </div>
  );
}