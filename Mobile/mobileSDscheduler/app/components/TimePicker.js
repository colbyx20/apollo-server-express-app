import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

function TimePicker({ onChange, newDate }) {
  //const [dateVisible, setDateVisible] = useState(false);
  // const [newDate, setDate] = useState(new Date(date));

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate;
  //   setDateVisible(false);
  //   setDate(currentDate);
  //   //console.log(newDate.toISOString());
  // };

  /*
  //NOTE:
  This should somehow be integrated with the TimePickerButton.js, 
  but I couldn't get the visibility to work by handling it on the AvailabilityModal.js.
  The current implementation is ugly, but it works

*/

  return (
    <DateTimePicker
      mode="time"
      value={new Date(newDate)}
      //is24Hour={false} //Lets make 24 hours the standard in the US
      onChange={() => {
        onChange;
        //setDateVisible(false);
      }}
      // onChange={() => {
      //   onChange;
      //   setDateVisible(false);
      // }}
      minuteInterval={30} //it's a bit buggy
    ></DateTimePicker>
  );
}

function normalizeDate(date, roundUp = true, local = false) {
  var newDate = date.split("T")[0];
  var hour;
  if (local) {
    hour = localTime(date).split(":")[0];
  } else {
    hour = parseInt(date.split("T")[1].split(":")[0]);
  }
  var mins = parseInt(date.split("T")[1].split(":")[1]);
  if (roundUp && 30 <= mins) {
    hour++;
  }
  newDate += "T" + hour + ":00:00.000Z";
  return newDate;
}

function localTime(date) {
  var localDate = new Date(date).toString().split(" ")[4];
  return localDate;
}

function dateToTimeString(date) {
  var newDate = normalizeDate(date, true, true).split("T")[1].split(":")[0];
  newDate += ":00";
  return newDate;
}
export default TimePicker;

const styles = StyleSheet.create({});
