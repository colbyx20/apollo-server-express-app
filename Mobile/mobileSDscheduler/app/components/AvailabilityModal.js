import React from "react";
import { StyleSheet, Modal, View } from "react-native";

import AppButton from "./AppButton";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import Screen from "./Screen";
import colors from "../config/colors";
import TimePicker from "./TimePicker";
import DayWeekSelect from "./DayWeekSelect";

function AvailabilityModal({ modalVisible, onPress }) {
  date = new Date();
  console.log(date);
  return (
    <Modal visible={modalVisible} animationType="slide">
      <Screen style={styles.background}>
        <AppText style={styles.title}>Please select availability</AppText>
        <AppText style={styles.text}>
          Select days where pattern repeats:
        </AppText>
        <DayWeekSelect></DayWeekSelect>
        <AppText style={styles.text}>Select start time:</AppText>
        <View style={styles.dateContainer}>
          <TimePicker date={date.toISOString()}></TimePicker>
        </View>
        <AppText style={styles.text}>Select end time:</AppText>
        <View style={styles.dateContainer}>
          <TimePicker date={date.toISOString()}></TimePicker>
        </View>

        <AppButton
          title="Close"
          onPress={onPress} //{() => setModalVisible(false)}
        />
      </Screen>
    </Modal>
  );
}

export default AvailabilityModal;

const styles = StyleSheet.create({
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
