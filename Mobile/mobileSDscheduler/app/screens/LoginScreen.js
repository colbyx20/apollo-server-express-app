import { StyleSheet, Image, ImageBackground, Dimensions } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import AppText from "../components/AppText";
import Constants from "expo-constants";
import apiClient from "../api/client";
import { useQuery } from "@apollo/client";
import { GROUPS } from "../gql/getAllGroups";
import Screen from "../components/Screen";
import colors from "../config/styles";
import ErrorMessage from "../components/ErrorMessage";
import { useEffect, useState } from "react";


const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required()
    .email()
    .matches(/\@ucf.edu$|\@knights.ucf.edu$/, "Must be UCF email")
    .label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
  //API SAUCE
  // const [groups, setGroups] = useState([]);

  // useEffect(() => {
  //   loadGroups();
  // }, []);

  // const loadGroups = async () => {
  //   const response = await apiClient.get("getAllGroups");
  //   setGroups(response.data);
  // };

  // console.log(groups);

  //-----------------
  // const [errors, setError] = useState([]);
  //TESTING THINGS
  //   const [groups, setGroups] = useState([]);

  // useEffect(() => {
  //   loadGroups();
  // }, [groups]);

  // const loadGroups = async () => {
  //   //const response = await useQuery(GROUPS);
  //   const { data, loading, error} = await useQuery(GROUPS);

  //   if (error) {
  //     return <AppText>Error: {error.message}</AppText>; //while loading return this
  //   }

  //   if (loading) {
  //     return <AppText>Fetching data...</AppText>; //while loading return this
  //   }
  //   setGroups(data);
  //   setError(error);
  // };

  // console.log(groups);

  const { data, loading, error } = useQuery(GROUPS);

  if (error) {
    return <AppText>Error: {error.message}</AppText>; //while loading return this
  }

  if (loading) {
    return <AppText>Fetching data...</AppText>; //while loading return this
  }

  console.log(data.getAllGroups);
  console.log(data.getAllGroups[0].groupName);

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
          onSubmit={(values) => console.log(values)}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleSubmit,
            errors,
            setFieldTouched,
            touched,
          }) => (
            <>
              <AppText>Hello</AppText>
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="email"
                keyboardType="email-address"
                onBlur={() => setFieldTouched("email")}
                onChangeText={handleChange("email")}
                placeholder="UCF Email"
                textContectType="emailAddress" //might need to remove
              />
              <ErrorMessage error={errors.email} visible={touched.email} />
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                onBlur={() => setFieldTouched("password")}
                onChangeText={handleChange("password")}
                placeholder="Password"
                secureTextEntry
                textContectType="password" //might need to remove
              />
              <ErrorMessage
                error={errors.password}
                visible={touched.password}
              />
              <AppButton
                title="Login"
                color="gold"
                onPress={handleSubmit}
              ></AppButton>
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
