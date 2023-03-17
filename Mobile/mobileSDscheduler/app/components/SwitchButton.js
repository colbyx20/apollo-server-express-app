import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../config/colors";

function SwitchButton({ title, isActive, onPress }) {
  var color = isActive ? colors.gold : colors.grayMedium;
  return (
    <TouchableOpacity
      style={styles.highlight}
      //underlayColor={colors.grayDark}
      onPress={onPress}
    >
      <View style={[styles.button, { backgroundColor: color }]}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default SwitchButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.gold,
    //backgroundColor: colors.primaryDark,
    height: 45,
    width: 45,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    //padding: 15,
    //marginVertical: 10,
  },
  highlight: {
    borderRadius: 25,
    height: 45,
    width: 45,
    marginVertical: 10,
    alignItems: "center",
  },
  text: {
    color: colors.primaryDark,
    // color: colors.secondaryDark,
    fontSize: 20,
    //textTransform: "uppercase",
    fontWeight: "bold",
  },
});
