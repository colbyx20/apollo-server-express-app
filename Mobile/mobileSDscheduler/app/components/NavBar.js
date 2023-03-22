import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, Image, TouchableHighlight } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

//        {rightButton && <Image style={styles.button} source={rightButton} />}
function NavBar({
  onPressLeft,
  leftButton,
  onPressCenter,
  rightButton,
  onPressRight,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TouchableHighlight
          style={styles.highlight}
          underlayColor={colors.grayLight}
          onPress={onPressLeft}
        >
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={40}
            color={colors.primaryDark}
          />
        </TouchableHighlight>
      </View>
      <View style={styles.middleContainer}>
        <TouchableHighlight
          style={styles.highlight}
          underlayColor={colors.grayLight}
          onPress={onPressCenter}
        >
          <MaterialCommunityIcons
            name="home-outline"
            size={40}
            color={colors.primaryDark}
          />
        </TouchableHighlight>
      </View>
      <View style={styles.rightContainer}>
        <TouchableHighlight
          style={styles.highlight}
          underlayColor={colors.grayLight}
          onPress={onPressRight}
        >
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={40}
            color={colors.primaryDark}
          />
        </TouchableHighlight>
      </View>
    </View>
  );
}

export default NavBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: colors.gold,
  },
  middleContainer: {
    backgroundColor: colors.gold, //colors.primaryDark,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  leftContainer: {
    backgroundColor: colors.gold,
    alignItems: "center",
    paddingLeft: 10,
    justifyContent: "center",
    flex: 1,
  },
  rightContainer: {
    backgroundColor: colors.gold,
    alignItems: "center",
    paddingRight: 10,
    justifyContent: "center",
    flex: 1,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: "blue",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.secondaryDark,
  },
  highlight: {
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
});
