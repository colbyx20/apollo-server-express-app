import React from "react";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ImageBackground,
} from "react-native";
import AppButton from "../components/AppButton";
// import { LinearGradient } from 'expo-linear-gradient';

import colors from "../config/colors";

function WelcomeScreen(props) {
  const [user] = useState();

  return (
    <>
      {user.privilege == "student" ? (
        <AppStudentNavigator />
      ) : (
        <AppProfessorNavigator />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
});

export default WelcomeScreen;
