import React, {useState} from 'react';
import { StyleSheet, Image, Text, StatusBar, ImageBackground, Dimensions} from "react-native";
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import Constants from "expo-constants";

import Screen from "../components/Screen"
import colors from "../config/styles";

function LoginScreen(props) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    return (
    <ImageBackground
        blurRadius={1.5}
        style={styles.background}
        source={require("../assets/ucf_51449133.jpg")}
      >
      <Screen style={styles.container}>   
        <Image 
            style={styles.logo}
            source={require("../assets/TheTab_KGrgb_300ppi.png")}/>
        <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            onChangeText={text => setEmail(text)}
            placeholder="Email"
            textContectType="emailAddress" //might need to remove
        />
        <AppTextInput
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            onChangeText={text => setPassword(text)}
            placeholder="Password"
            secureTextEntry
            textContectType="password" //might need to remove
        />
        <AppButton title="Login" color='gold' onPress={() => console.log(email, password)}></AppButton>
      </Screen>
      </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    logo: {
        width: 80,
        height: 100,
        alignSelf: "center",
        borderRadius: 10,
        marginTop: 50,
        marginBottom: 50,
    },
    background: {
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: Dimensions.get('window').height+Constants.statusBarHeight+10,
      },
})

export default LoginScreen;