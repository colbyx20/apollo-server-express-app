import React from "react";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function GroupItemEditAction({ onPress }) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onPress}>
        <MaterialCommunityIcons
          name="pencil"
          size={35}
          color={colors.grayLight}
        />
      </TouchableWithoutFeedback>
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
});

export default GroupItemEditAction;
