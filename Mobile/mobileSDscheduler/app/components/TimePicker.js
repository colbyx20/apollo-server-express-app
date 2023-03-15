import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import defaultStyles from "../config/styles";

function TimePicker({ date, color = "gold" }) {
  const [dateVisible, setDateVisible] = useState(false);
  const [newDate, setDate] = useState(new Date(date));

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDateVisible(false);
    setDate(currentDate);
    console.log(newDate.toISOString());
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: defaultStyles.colors[color] }]}
      onPress={() => setDateVisible(true)}
    >
      {dateVisible && (
        <DateTimePicker
          mode="time"
          value={newDate}
          //is24Hour={false} //Lets make 24 hours the standard in the US
          onChange={onChange}
          minuteInterval={30} //it's a bit buggy
        ></DateTimePicker>
      )}
      <MaterialCommunityIcons
        name="clock-outline"
        size={20}
        color={defaultStyles.colors.grayMedium}
        style={styles.icon}
      />
      <View style={styles.container}>
        <Text style={styles.text}>
          {dateToTimeString(newDate.toISOString())}
        </Text>
      </View>
    </TouchableOpacity>
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

const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.gold,
    borderRadius: 25,
    //justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "30%",
    marginVertical: 10,
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
