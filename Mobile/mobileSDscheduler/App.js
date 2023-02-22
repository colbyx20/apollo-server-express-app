import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import AccountScreen from "./app/screens/AccountScreen";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import HomeScreen from "./app/screens/HomeScreen";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "https://sea-turtle-app-msdsw.ondigitalocean.app/graphql",
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    //<WelcomeScreen></WelcomeScreen>
    //<LoginScreen></LoginScreen>
    //<AccountScreen></AccountScreen>
    <ApolloProvider client={client}>
      <HomeScreen></HomeScreen>
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
