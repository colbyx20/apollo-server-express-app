import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import { TouchableHighlight } from "react-native-gesture-handler";

function AppointmentItemAddAction({ onPress }) {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        underlayColor={colors.grayMedium}
        onPress={onPress}
        style={styles.button}
      >
        <MaterialCommunityIcons
          name="plus"
          size={40}
          color={colors.grayLight}
        />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.green,
    borderRadius: 25,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 80,
    borderRadius: 25,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppointmentItemAddAction;
