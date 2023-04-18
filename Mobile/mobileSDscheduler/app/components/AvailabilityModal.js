import React, { useState, useContext } from "react";
import { StyleSheet, Modal, TouchableOpacity, View } from "react-native";

import AppButton from "./AppButton";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import Screen from "./Screen";
import ErrorMessage from "./ErrorMessage";
import colors from "../config/colors";

import { useMutation } from "@apollo/client";
import { AVAILABILITY } from "../gql/mutations/createProfessorSchedule";
import AuthContext from "../auth/context";

import DateTimePicker from "@react-native-community/datetimepicker";
import DayWeekSelect from "./DayWeekSelect";

import defaultStyles from "../config/styles";
import TimePickerButton from "./TimePickerButton";

function AvailabilityModal({ modalVisible, onPress, dayIndex, dateString }) {
  const { user } = useContext(AuthContext);
  const [addAvailability] = useMutation(AVAILABILITY);

  const [startTimeVisible, setStartTimeVisible] = useState(false);
  const [endTimeVisible, setEndTimeVisible] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [days, setDays] = useState([
    { name: "Sun", isActive: false },
    { name: "Mon", isActive: false },
    { name: "Tue", isActive: false },
    { name: "Wed", isActive: false },
    { name: "Thu", isActive: false },
    { name: "Fri", isActive: false },
    { name: "Sat", isActive: false },
  ]);

  const [validInterval, setValidInterval] = useState(true);

  var daysOfWeek = [];
  getDaysOfWeek(dateString, dayIndex);
  //console.log(daysOfWeek);

  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log("hello start");
    setStartTimeVisible(false);
    setStartTime(currentDate);
    setValidInterval(startTime <= endTime);
    //console.log(newDate.toISOString());
  };

  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log("hello end");
    setEndTimeVisible(false);
    setEndTime(currentDate);
    setValidInterval(startTime <= endTime);
    //console.log(newDate.toISOString());
  };

  const onPressSave = () => {
    setValidInterval(startTime <= endTime);
    console.log(
      "SAVED ",
      roundMinutes(startTime).getHours(),
      " ",
      roundMinutes(endTime).getHours()
    );
    var times = getAvailability(
      days,
      daysOfWeek,
      startTime.getHours(),
      endTime.getHours()
    );
    handleSave(times);
    console.log(times);
  };

  function handleSave(times) {
    addAvailability({
      variables: {
        id: user.loginUser._id,
        privilege: user.loginUser.privilege,
        time: times,
      },
    });
  }

  return (
    <Modal visible={modalVisible} animationType="slide">
      <Screen style={styles.background}>
        <AppText style={styles.title}>
          Please select availability for this week
        </AppText>
        <AppText style={styles.text}>
          Week of {new Date(daysOfWeek[1]).toDateString()}
        </AppText>
        <AppText style={styles.text}>
          Select days where pattern repeats:
        </AppText>
        <DayWeekSelect
          dayIndex={dayIndex}
          days={days}
          setDays={setDays}
        ></DayWeekSelect>
        <AppText style={styles.text}>Select start time:</AppText>
        {startTimeVisible && (
          <DateTimePicker
            mode="time"
            value={startTime}
            //is24Hour={false} //Lets make 24 hours the standard in the US
            onChange={onStartChange}
            minuteInterval={30} //it's a bit buggy
          ></DateTimePicker>
        )}
        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: defaultStyles.colors.gold },
            ]}
            onPress={() => setStartTimeVisible(true)}
          >
            <TimePickerButton
              newDate={startTime.toISOString()}
            ></TimePickerButton>
          </TouchableOpacity>
        </View>
        <AppText style={styles.text}>Select end time:</AppText>
        {endTimeVisible && (
          <DateTimePicker
            mode="time"
            value={endTime}
            //is24Hour={false} //Lets make 24 hours the standard in the US
            onChange={onEndChange}
            minuteInterval={30} //it's a bit buggy
          ></DateTimePicker>
        )}
        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: defaultStyles.colors.gold },
            ]}
            onPress={() => setEndTimeVisible(true)}
          >
            <TimePickerButton
              newDate={endTime.toISOString()}
            ></TimePickerButton>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          {!validInterval && (
            <ErrorMessage
              error={"The end time has to be after the start time"}
              visible={!validInterval}
            />
          )}
          <AppButton
            title="Save"
            onPress={onPressSave} //{() => setModalVisible(false)}
          />
          <AppButton
            title="Close"
            onPress={onPress} //{() => setModalVisible(false)}
          />
        </View>
      </Screen>
    </Modal>
  );

  function getDaysOfWeek(date, index) {
    for (var i = 0; 7 > i; i++) {
      var tempDate = new Date(date);
      tempDate.setDate(tempDate.getDate() - index + i);
      daysOfWeek.push(tempDate.toISOString());
    }
  }

  function getAvailability(days, week, startTime, endTime) {
    var availability = [];
    for (var i = 0; 7 > i; i++) {
      if (days[i].isActive) {
        for (var t = startTime; endTime > t; t++) {
          var slot = new Date(week[i].split("T")[0]);
          slot.setDate(slot.getDate() + 1);
          slot.setHours(slot.getUTCHours() + t);
          availability.push(slot);
        }
      }
    }
    return availability;
  }
}

export default AvailabilityModal;

function roundMinutes(date) {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
  date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

  return date;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.gold,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    flex: 1,
  },
  background: {
    padding: 10,
    backgroundColor: colors.primaryDark,
    flex: 1,
  },
  title: {
    color: colors.secondaryDark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    alignSelf: "center",
    fontWeight: "bold",
    paddingBottom: 40,
  },
  text: {
    color: colors.secondaryDark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 5,
  },
  dateContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
