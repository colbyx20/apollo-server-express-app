import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Initialize Apollo Client
const uri= "https://sea-turtle-app-msdsw.ondigitalocean.app/graphql";
const local_uri = "http://localhost:8080/graphql"
const client = new ApolloClient({
  uri: local_uri,
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    //<WelcomeScreen></WelcomeScreen>
    <ApolloProvider client={client}>
      <LoginScreen></LoginScreen>
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
