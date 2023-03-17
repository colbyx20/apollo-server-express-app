import React from "react";
import { StyleSheet, View, Image, TouchableHighlight } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

//        {rightButton && <Image style={styles.button} source={rightButton} />}
function TitleBar({
  onPressLeft,
  leftButton,
  title,
  rightButton,
  onPressRight,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {leftButton && (
          <TouchableHighlight
            style={styles.highlight}
            underlayColor={colors.grayMedium}
            onPress={onPressLeft}
          >
            {leftButton}
          </TouchableHighlight>
        )}
      </View>
      <AppText style={styles.title}>{title}</AppText>
      <View style={styles.rightContainer}>
        {rightButton && (
          <TouchableHighlight
            style={styles.highlight}
            underlayColor={colors.grayMedium}
            onPress={onPressRight}
          >
            {rightButton}
          </TouchableHighlight>
        )}
      </View>
    </View>
  );
}

export default TitleBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  title: {
    color: colors.secondaryDark,
    fontSize: 20,
    alignSelf: "center",
    paddingBottom: 10,
    paddingTop: 20,
    backgroundColor: colors.primaryDark,
  },
  titleContainer: {
    backgroundColor: "red", //colors.primaryDark,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  leftContainer: {
    backgroundColor: colors.primaryDark,
    alignItems: "flex-start",
    paddingLeft: 10,
    justifyContent: "center",
    flex: 1,
    borderColor: colors.secondaryDark,
  },
  rightContainer: {
    backgroundColor: colors.primaryDark,
    alignItems: "flex-end",
    paddingRight: 10,
    justifyContent: "center",
    flex: 1,
    borderColor: colors.secondaryDark,
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
  },
});
