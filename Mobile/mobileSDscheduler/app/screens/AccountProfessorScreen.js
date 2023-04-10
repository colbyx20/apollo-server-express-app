import React, { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Image, StyleSheet, Dimensions, View } from "react-native";
import Constants from "expo-constants";

import { useMutation, useQuery } from "@apollo/client";
import { PROFESSOR } from "../gql/queries/getProfessor";
import { PROFESSOR_EMAIL } from "../gql/mutations/editProfessor";
import { Formik } from "formik";
import * as Yup from "yup";

import ErrorMessage from "../components/ErrorMessage";
import AppButton from "../components/AppButton";
import AppFormButton from "../components/AppFormButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import Screen from "../components/Screen";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  // email: Yup.string()
  //   .email()
  //   .matches(/\@ucf.edu$|\@knights.ucf.edu$/, "Must be UCF email")
  //   .label("Email"),
  notifEmail: Yup.string().email().label("Email"),
  password: Yup.string().min(7).label("Password"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

function AccountScreen(props) {
  //APOLLO CLIENT
  const { data, loading, error, refetch } = useQuery(PROFESSOR, {
    variables: {
      id: "6414996286c77fadcb080900",
      getProfessorId2: "6414996286c77fadcb080900",
    },
  });

  const [notificationEmail] = useMutation(PROFESSOR_EMAIL);

  useFocusEffect(() => {
    console.log("Refetch accnt");
    refetch();
  });

  if (error) {
    return <AppText>Error: {error.message}</AppText>; //while loading return this
  }

  if (loading) {
    return <AppText>Fetching data...</AppText>; //while loading return this
  }

  // console.log(data.getAllGroups[0].groupName);
  console.log(data);
  console.log(data.getProfessor.professorFName);
  var fname = upperFirstLetter(data.getProfessor.professorFName);
  var lname = upperFirstLetter(data.getProfessor.professorLName);
  var curEmail = data.getUserInfo.email;
  var curNotifEmail = data.getUserInfo.notificationEmail;

  // const handleSubmit = ({ email, notifEmail }) => {
  //   console.log("Submit! " + email + " " + notifEmail);
  //   notificationEmail({
  //     variables: { id: "6414996286c77fadcb080900", email: notifEmail },
  //     onCompleted: () => {
  //       refetch()
  //     }
  //   });
  // };

  const handleSubmit = ({ notifEmail }) => {
    //email,
    console.log("Submit! " + email + " " + notifEmail);
    notificationEmail({
      variables: {
        // id: "6414996286c77fadcb080900",
        // professorInput: {
        //   email: email,
        // },
        editNotificationEmailId2: "6414996286c77fadcb080900",
        email: notifEmail,
      },
    });
  };

  return (
    <Screen style={styles.background}>
      <Image style={styles.pfp} source={require("../assets/knightro.png")} />
      <AppText style={styles.text}>
        Hello {fname} {lname}!
      </AppText>
      <Formik
        initialValues={{
          notifEmail: curNotifEmail,
          password: "",
          confirmPassword: "",
        }} // email: curEmail,
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ handleChange, errors, setFieldTouched, touched, values }) => (
          <>
            {/* <AppText style={styles.subtitle}>Change Login email:</AppText>
            <AppTextInput
              autoCapitalize="none"
              autoCorrect={false}
              icon="email"
              keyboardType="email-address"
              onBlur={() => setFieldTouched("email")}
              onChangeText={handleChange("email")}
              placeholder={curEmail}
              textContextType="emailAddress" //might need to remove
            />
            <ErrorMessage error={errors.email} visible={touched.email} /> */}
            {curNotifEmail == "" ? (
              <AppText style={styles.subtitle}>Add Notification email:</AppText>
            ) : (
              <AppText style={styles.subtitle}>
                Change Notification email:
              </AppText>
            )}
            <AppTextInput
              autoCapitalize="none"
              autoCorrect={false}
              icon="email"
              keyboardType="email-address"
              onBlur={() => setFieldTouched("notifEmail")}
              onChangeText={handleChange("notifEmail")}
              placeholder={curNotifEmail}
              textContextType="emailAddress" //might need to remove
            />
            <ErrorMessage
              error={errors.notifEmail}
              visible={touched.notifEmail}
            />
            <AppText style={styles.subtitle}>Change password:</AppText>
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
            <ErrorMessage error={errors.password} visible={touched.password} />
            <AppTextInput
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock"
              onBlur={() => setFieldTouched("confirmPassword")}
              onChangeText={handleChange("confirmPassword")}
              placeholder="Confirm Password"
              secureTextEntry
              textContextType="password" //might need to remove
            />
            <ErrorMessage
              error={errors.confirmPassword}
              visible={touched.confirmPassword}
            />
            <AppFormButton
              title="Save"
              color="gold"
              onPress={handleSubmit}
            ></AppFormButton>
          </>
        )}
      </Formik>
      <View style={styles.container}>
        <AppButton
          title="Logout"
          color="gold"
          onPress={() => console.log("logout")}
          style={styles.button}
        ></AppButton>
      </View>
    </Screen>
  );
}

function upperFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    flex: 1,
  },
  background: {
    padding: 10,
    backgroundColor: colors.primaryDark,
    flex: 1,
  },
  button: {
    justifyContent: "flex-end",
  },
  pfp: {
    width: 150,
    height: 150,
    alignSelf: "center",
    borderRadius: 75,
    marginTop: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: colors.secondaryDark,
  },
  text: {
    color: colors.secondaryDark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: colors.secondaryDark,
    fontSize: 15,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    fontWeight: "bold",
  },
});

export default AccountScreen;
