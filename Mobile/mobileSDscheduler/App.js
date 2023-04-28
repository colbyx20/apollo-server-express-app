import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import AccountScreen from "./app/screens/AccountProfessorScreen";
import HomeScreen from "./app/screens/HomeProfessorScreen";
import HomeStudentScreen from "./app/screens/HomeStudentScreen";
import CalendarProfessorScreen from "./app/screens/CalendarProfessorScreen";
import CalendarStudentScreen from "./app/screens/CalendarStudentScreen";
import AppLoading from "expo-app-loading";
//import * as SplashScreen from "expo-splash-screen";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import AppProfessorNavigator from "./navigation/AppProfessorNavigator";
import AppStudentNavigator from "./navigation/AppStudentNavigator";
import NavigationTheme from "./navigation/NavigationTheme";
import { useCallback, useEffect, useState } from "react";
import AuthContext from "./app/auth/context";
import AccountStudentScreen from "./app/screens/AccountStudentScreen";
import authStorage from "./app/auth/storage";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "https://dolphin-app-djupw.ondigitalocean.app/graphql", //"https://sea-turtle-app-msdsw.ondigitalocean.app/graphql",
  cache: new InMemoryCache(),
});

// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const restoreUser = async () => {
    const userInfo = await authStorage.getUser();
    if (!userInfo) return;
    var jsonUserInfo = JSON.parse(userInfo);
    setUser(jsonUserInfo);
  };

  useEffect(() => {
    restoreUser();
  }, []);

  if (!isReady)
    return (
      <AppLoading
        startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
        onError={console.log}
      />
    );

  // useEffect(() => {
  //   async function restoreUser() {
  //     try {
  //       const userInfo = await authStorage.getUser();
  //       if (!userInfo) return;
  //       var jsonUserInfo = JSON.parse(userInfo);
  //       setUser(jsonUserInfo);
  //     } catch (error) {
  //       console.log("Error while restoring user", error);
  //     } finally {
  //       setIsReady(true);
  //     }
  //   }

  //   restoreUser();
  // }, []);

  // const onLayoutRootView = useCallback(async () => {
  //   if (isReady) {
  //     // This tells the splash screen to hide immediately! If we call this after
  //     // `setAppIsReady`, then we may see a blank screen while the app is
  //     // loading its initial state and rendering its first pixels. So instead,
  //     // we hide the splash screen once we know the root view has already
  //     // performed layout.
  //     await SplashScreen.hideAsync();
  //   }
  // }, [isReady]);

  // if (!isReady) {
  //   return null;
  // }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ApolloProvider client={client}>
        {user ? (
          <NavigationContainer theme={NavigationTheme}>
            <AppProfessorNavigator />
          </NavigationContainer>
        ) : (
          <LoginScreen></LoginScreen>
        )}
      </ApolloProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
