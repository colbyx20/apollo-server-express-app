import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import defaultStyles from "../config/styles";

function TimePickerButton({ newDate }) {
  return (
    <View style={styles.button}>
      <MaterialCommunityIcons
        name="clock-outline"
        size={20}
        color={defaultStyles.colors.grayMedium}
        style={styles.icon}
      />
      <View style={styles.container}>
        <Text style={styles.text}>{dateToTimeString(newDate)}</Text>
      </View>
    </View>
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

export default TimePickerButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.gold,
    borderRadius: 25,
    alignItems: "center",
    padding: 15,
    width: "30%",
    flexDirection: "row",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: defaultStyles.colors.primaryDark,
    fontSize: 20,
    //textTransform: "uppercase",
    fontWeight: "bold",
  },
});
