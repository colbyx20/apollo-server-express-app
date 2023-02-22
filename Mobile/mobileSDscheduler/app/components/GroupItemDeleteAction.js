import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function GroupItemDeleteAction({ onPress }) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onPress}>
        <MaterialCommunityIcons
          name="trash-can"
          size={35}
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
});

export default GroupItemDeleteAction;
