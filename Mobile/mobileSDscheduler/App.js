import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import AccountScreen from "./app/screens/AccountScreen";
import HomeScreen from "./app/screens/HomeScreen";
import CalendarProfessorScreen from "./app/screens/CalendarProfessorScreen";
import CalendarStudentScreen from "./app/screens/CalendarStudentScreen";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "https://dolphin-app-djupw.ondigitalocean.app/graphql",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    //<WelcomeScreen></WelcomeScreen>
    //<LoginScreen></LoginScreen>
    //<AccountScreen></AccountScreen>
    //<HomeScreen></HomeScreen>
    //<CalendarScreen></CalendarScreen>
    <ApolloProvider client={client}>
      <CalendarProfessorScreen></CalendarProfessorScreen>
    </ApolloProvider>
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
