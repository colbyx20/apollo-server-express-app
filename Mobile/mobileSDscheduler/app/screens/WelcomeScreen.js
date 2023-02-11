import React from 'react';
import { StyleSheet, View, Text, StatusBar, ImageBackground } from "react-native";
import AppButton from '../components/AppButton';
// import { LinearGradient } from 'expo-linear-gradient';

import colors from "../config/colors";

function WelcomeScreen(props) {
    return (
      <ImageBackground
        blurRadius={1.5}
        style={styles.background}
        source={require("../assets/ucf_51449133.jpg")}
      >
        <View style={styles.buttonsContainer}>
          <AppButton title="Login" color='gold'/>
          {/* <AppButton title="Register" color='gold'/> */}
        </View>
      </ImageBackground>
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
})

export default WelcomeScreen;