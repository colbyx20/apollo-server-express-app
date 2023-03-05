import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function GroupItemDeleteAction({ onPress }) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onPress} style={styles.button}>
        <MaterialCommunityIcons
          name="trash-can"
          size={40}
          color={colors.grayLight}
        />
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.red,
    borderRadius: 25,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 80,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default GroupItemDeleteAction;
