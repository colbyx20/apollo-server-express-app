import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import SwitchButton from "./SwitchButton";

function DayWeekSelect({ dayIndex }) {
  const [days, setDays] = useState([
    { name: "Sun", isActive: false },
    { name: "Mon", isActive: false },
    { name: "Tue", isActive: false },
    { name: "Wed", isActive: false },
    { name: "Thu", isActive: false },
    { name: "Fri", isActive: false },
    { name: "Sat", isActive: false },
  ]);

  function handlePress(index) {
    //console.log("handling press ", index);
    const newDays = days.map((item, i) => {
      //console.log(item);
      if (i === index) {
        return { name: item.name, isActive: !item.isActive }; //newDay;
      } else {
        return item;
      }
    });
    setDays(newDays);
  }

  //   var days = [
  //     { name: "Sun", isActive: true },
  //     { name: "Mon", isActive: false },
  //     { name: "Tue", isActive: false },
  //     { name: "Wed", isActive: false },
  //     { name: "Thu", isActive: false },
  //     { name: "Fri", isActive: false },
  //     { name: "Sat", isActive: false },
  //   ];
  // var days = [true, false, false, false, false, false, false];
  // var nameDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  useLayoutEffect(() => {
    handlePress(dayIndex);
  }, []);
  return (
    <View style={styles.container}>
      {days.map((item, i) => (
        <SwitchButton
          key={item.name}
          title={item.name}
          isActive={item.isActive}
          onPress={() => handlePress(i)}
        />
      ))}
    </View>
  );
}

export default DayWeekSelect;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
