import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import LoginScreen from "./app/screens/LoginScreen";
import AccountScreen from "./app/screens/AccountScreen";

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";

// Initialize Apollo Client
const uri= "https://sea-turtle-app-msdsw.ondigitalocean.app/graphql";
const local_uri = "http://localhost:8080/graphql"


const httpLink = createHttpLink({
  uri: local_uri,
  credentials: 'include',
  cache: new InMemoryCache()
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default function App() {
  return (
    //<WelcomeScreen></WelcomeScreen>
    //<LoginScreen></LoginScreen>
    <ApolloProvider client={client}>
      <AccountScreen></AccountScreen>
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
