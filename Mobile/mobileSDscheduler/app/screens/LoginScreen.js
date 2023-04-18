import {
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  View,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import AppFormButton from "../components/AppFormButton";
import AppTextInput from "../components/AppTextInput";
import AppText from "../components/AppText";
import Constants from "expo-constants";
import apiClient from "../api/client";
import { useMutation } from "@apollo/client";
import { GROUPS } from "../gql/queries/getAllGroups";
import { LOGIN_USER } from "../gql/mutations/loginUser";

import Screen from "../components/Screen";
import colors from "../config/colors";
import ErrorMessage from "../components/ErrorMessage";
import { useContext, useEffect, useState } from "react";
import GroupItem from "../components/GroupItem";
import GroupItemDeleteAction from "../components/GroupItemDeleteAction";
import GroupItemEditAction from "../components/GroupItemEditAction";
import AuthContext from "../auth/context";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().label("Email"),
  // email: Yup.string()
  //   .required()
  //   .email()
  //   .matches(/\@ucf.edu$|\@knights.ucf.edu$/, "Must be UCF email")
  //   .label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
  const authContext = useContext(AuthContext);
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);

  const handleSubmit = async ({ email, password }) => {
    console.log(email, " ", password);

    await loginUser({
      variables: {
        loginInput: {
          email: email.toLowerCase(),
          password: password,
        },
      },
    });

    if (error) {
      return <AppText>Error: {error.message}</AppText>; //while loading return this
    }

    if (loading) {
      return <AppText>Fetching data...</AppText>; //while loading return this
    }

    if (data.loginUser != null && data.loginUser.privilege != "coordinator") {
      authContext.setUser(data);
    }
    console.log("Data: ", data);
  };

  // useEffect(() => {
  //   console.log("Data: ", authContext.user);
  // });

  return (
    <ImageBackground
      blurRadius={1.5}
      style={styles.background}
      source={require("../assets/ucf_51449133.jpg")}
    >
      <Screen style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/TheTab_KGrgb_300ppi.png")}
        />

        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleChange, errors, setFieldTouched, touched }) => (
            <>
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                onBlur={() => setFieldTouched("email")}
                onChangeText={handleChange("email")}
                placeholder="UCF Email"
                textContextType="emailAddress" //might need to remove
              />
              <ErrorMessage error={errors.email} visible={touched.email} />
              <AppText></AppText>
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                onBlur={() => setFieldTouched("password")}
                onChangeText={handleChange("password")}
                placeholder="Password"
                secureTextEntry
                textContextType="password" //might need to remove
              />
              <ErrorMessage
                error={errors.password}
                visible={touched.password}
              />
              <AppText></AppText>
              <AppFormButton
                title="Login"
                color="gold"
                onPress={handleSubmit}
              ></AppFormButton>
            </>
          )}
        </Formik>
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
    height: Dimensions.get("window").height + Constants.statusBarHeight + 10,
  },
});

export default LoginScreen;
