import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import AccountScreen from "./app/screens/AccountProfessorScreen";
import HomeScreen from "./app/screens/HomeProfessorScreen";
import HomeStudentScreen from "./app/screens/HomeStudentScreen";
import CalendarProfessorScreen from "./app/screens/CalendarProfessorScreen";
import CalendarStudentScreen from "./app/screens/CalendarStudentScreen";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import AppProfessorNavigator from "./navigation/AppProfessorNavigator";
import AppStudentNavigator from "./navigation/AppStudentNavigator";
import NavigationTheme from "./navigation/NavigationTheme";
import { useState } from "react";
import AuthContext from "./app/auth/context";
import AccountStudentScreen from "./app/screens/AccountStudentScreen";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "https://dolphin-app-djupw.ondigitalocean.app/graphql", //"https://sea-turtle-app-msdsw.ondigitalocean.app/graphql",
  cache: new InMemoryCache(),
});

export default function App() {
  const [user, setUser] = useState();

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
