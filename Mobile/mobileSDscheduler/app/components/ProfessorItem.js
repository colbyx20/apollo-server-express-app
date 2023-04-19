import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  Modal,
  Button,
} from "react-native";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import AppButton from "./AppButton";
import Screen from "./Screen";
import colors from "../config/colors";
import AppText from "./AppText";

function ProfessorItem({ name, version, image, role, style, onPress }) {
  return (
    <View style={style}>
      <TouchableHighlight
        style={styles.highlight}
        underlayColor={colors.grayMedium}
        onPress={onPress}
      >
        <View style={styles.container}>
          <View>{image && <Image style={styles.image} source={image} />}</View>
          <View style={styles.details}>
            <AppText style={styles.title}>
              {name} - Role: {role} - V{version}
            </AppText>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold,
    borderRadius: 25,
    padding: 7,
  },
  details: {
    flex: 1,
  },
  highlight: {
    borderRadius: 25,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    alignSelf: "center",
  },
  number: {
    alignSelf: "flex-end",
    fontSize: 15,
    marginRight: 10,
    fontStyle: "italic",
  },
  subTitle: {
    color: colors.grayMedium,
    fontSize: 13,
    fontStyle: "italic",
  },
  title: {
    fontWeight: "600",
  },
});

export default ProfessorItem;
