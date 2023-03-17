import React from "react";
import { Image, StyleSheet, Dimensions, View } from "react-native";
import Constants from "expo-constants";

import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import Screen from "../components/Screen";
import colors from "../config/colors";

function AccountScreen(props) {
  return (
    <Screen style={styles.background}>
      <Image
        style={styles.pfp}
        source={require("../assets/TheTab_KGrgb_300ppi.png")}
      />
      <AppText style={styles.text}>Hello Professor Leinecker</AppText>
      <AppTextInput
        autoCapitalize="none"
        autoCorrect={false}
        icon="email"
        keyboardType="email-address"
        placeholder="UCF Email"
        textContextType="emailAddress" //might need to remove
      />
      <AppTextInput
        autoCapitalize="none"
        autoCorrect={false}
        icon="lock"
        placeholder="Password"
        secureTextEntry
        textContextType="password" //might need to remove
      />
      <View style={styles.container}>
        <AppButton
          title="Logout"
          color="gold"
          onPress={() => console.log("logout")}
          style={styles.button}
        ></AppButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    flex: 1,
  },
  background: {
    padding: 10,
    backgroundColor: colors.primaryDark,
    flex: 1,
  },
  button: {
    justifyContent: "flex-end",
  },
  pfp: {
    width: 150,
    height: 150,
    alignSelf: "center",
    borderRadius: 75,
    marginTop: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: colors.secondaryDark,
  },
  text: {
    color: colors.secondaryDark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    alignSelf: "center",
    fontWeight: "bold",
  },
});

export default AccountScreen;
