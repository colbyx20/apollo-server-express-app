import React, { useState } from "react";
import { StyleSheet, Modal, TouchableOpacity, View } from "react-native";

import AppButton from "./AppButton";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import Screen from "./Screen";
import colors from "../config/colors";

import DateTimePicker from "@react-native-community/datetimepicker";
import DayWeekSelect from "./DayWeekSelect";

import defaultStyles from "../config/styles";
import TimePickerButton from "./TimePickerButton";

function AvailabilityModal({ modalVisible, onPress, dayIndex }) {
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log("hello start");
    setStartDateVisible(false);
    setStartDate(currentDate);
    //console.log(newDate.toISOString());
  };

  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log("hello end");
    setEndDateVisible(false);
    setEndDate(currentDate);
    //console.log(newDate.toISOString());
  };

  const onPressSave = () => {
    console.log("SAVED");
  };

  return (
    <Modal visible={modalVisible} animationType="slide">
      <Screen style={styles.background}>
        <AppText style={styles.title}>Please select availability</AppText>
        <AppText style={styles.text}>
          Select days where pattern repeats:
        </AppText>
        <DayWeekSelect dayIndex={dayIndex}></DayWeekSelect>
        <AppText style={styles.text}>Select start time:</AppText>
        {startDateVisible && (
          <DateTimePicker
            mode="time"
            value={startDate}
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
            onPress={() => setStartDateVisible(true)}
          >
            <TimePickerButton
              newDate={startDate.toISOString()}
            ></TimePickerButton>
          </TouchableOpacity>
        </View>
        <AppText style={styles.text}>Select end time:</AppText>
        {endDateVisible && (
          <DateTimePicker
            mode="time"
            value={endDate}
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
            onPress={() => setEndDateVisible(true)}
          >
            <TimePickerButton
              newDate={endDate.toISOString()}
            ></TimePickerButton>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
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
}

export default AvailabilityModal;

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
