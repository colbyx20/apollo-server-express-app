import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Button } from "react-native";

import colors from "../config/colors";

function AppButton({ title, onPress, color = "gold" }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.gold,
    //backgroundColor: colors.primaryDark,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },
  text: {
    color: colors.primaryDark,
    // color: colors.secondaryDark,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
