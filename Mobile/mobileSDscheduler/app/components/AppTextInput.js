import React from "react";
import { TextInput, View, StyleSheet, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";

function AppTextInput({ icon, ...otherProps }) {
  return (
    <View style={styles.container}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.grayMedium}
          style={styles.icon}
        />
      )}
      <TextInput style={defaultStyles.inputText} {...otherProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: colors.grayDark,
    alignItems: "center",
    backgroundColor: defaultStyles.colors.gold,
    borderRadius: 25,
    flexDirection: "row",
    width: "100%",
    padding: 13,
    marginVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  // textInput: {
  //     color: colors.grayDark,
  //     fontSize: 18,
  //     fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  //     width: "100%",
  // }
});

export default AppTextInput;
