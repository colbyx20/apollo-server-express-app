import React from 'react';
import Constants from "expo-constants";
import { StyleSheet } from "react-native";

function Screen({children}) {
    return (
        <SafeAreaView styles={styles.screen}>
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: Constants.statusBarHeight
    }
})

export default Screen;