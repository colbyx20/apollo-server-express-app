import React, { useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Image, StyleSheet, View } from "react-native";

import { useMutation, useQuery } from "@apollo/client";
import { PROFESSOR } from "../gql/queries/getProfessor";
import { PROFESSOR_EMAIL } from "../gql/mutations/editProfessor";
import { PASSWORD } from "../gql/mutations/updatePassword";
import { Formik } from "formik";
import * as Yup from "yup";

import ErrorMessage from "../components/ErrorMessage";
import AppButton from "../components/AppButton";
import AppFormButton from "../components/AppFormButton";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import Screen from "../components/Screen";
import colors from "../config/colors";
import AuthContext from "../auth/context";

const validationSchema = Yup.object().shape({
  notifEmail: Yup.string().email().label("Email"),
  oldPassword: Yup.string().min(4).label("Password"),
  password: Yup.string().min(4).label("Password"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "New Passwords must match"
  ),
});

function AccountProfessorScreen(props) {
  const { user, setUser } = useContext(AuthContext);
  //APOLLO CLIENT
  const { data, loading, error, refetch } = useQuery(PROFESSOR, {
    variables: {
      id: user.loginUser._id,
      getProfessorId2: user.loginUser._id,
    },
  });

  const [notificationEmail] = useMutation(PROFESSOR_EMAIL);
  const [updatePassWord] = useMutation(PASSWORD);

  useFocusEffect(() => {
    refetch();
  });

  if (error) {
    return <AppText>Error: {error.message}</AppText>; //while loading return this
  }

  if (loading) {
    return <AppText>Fetching data...</AppText>; //while loading return this
  }

  var fname = upperFirstLetter(user.loginUser.firstname);
  var lname = upperFirstLetter(user.loginUser.lastname);
  var curEmail = data.getUserInfo.email;
  var curNotifEmail = data.getUserInfo.notificationEmail;

  const handleSubmit = ({
    notifEmail,
    oldPassword,
    password,
    confirmPassword,
  }) => {
    //email,
    if (notifEmail != "") {
      notificationEmail({
        variables: {
          id: user.loginUser._id,
          email: notifEmail,
        },
      });
    }

    if (password != "" && oldPassword != "" && confirmPassword != "") {
      updatePassWord({
        variables: {
          id: user.loginUser._id,
          oldPassword: oldPassword,
          newPassword: password,
          confirmedPassword: confirmPassword,
        },
      });
    }
  };

  return (
    <Screen style={styles.notifBar}>
      <View style={styles.screen}>
        <Image style={styles.pfp} source={require("../assets/knightro.png")} />
        <AppText style={styles.text}>
          Hello {fname} {lname}!
        </AppText>
        <Formik
          initialValues={{
            notifEmail: "",
            oldPassword: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleChange, errors, setFieldTouched, touched, values }) => (
            <>
              {curNotifEmail == "" ? (
                <AppText style={styles.subtitle}>
                  Add Notification email:
                </AppText>
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
                onBlur={() => setFieldTouched("oldPassword")}
                onChangeText={handleChange("oldPassword")}
                placeholder="Current Password"
                secureTextEntry
                textContextType="password" //might need to remove
              />
              <ErrorMessage
                error={errors.oldPassword}
                visible={touched.oldPassword}
              />
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                onBlur={() => setFieldTouched("password")}
                onChangeText={handleChange("password")}
                placeholder="New Password"
                secureTextEntry
                textContextType="password" //might need to remove
              />
              <ErrorMessage
                error={errors.password}
                visible={touched.password}
              />
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
            onPress={() => {
              setUser(null);
            }}
            style={styles.button}
          ></AppButton>
        </View>
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
  notifBar: {
    backgroundColor: colors.gold, //colors.primaryDark,
    height: "100%",
  },
  button: {
    justifyContent: "flex-end",
  },
  pfp: {
    width: 150,
    height: 150,
    alignSelf: "center",
    borderRadius: 75,
    marginTop: 5,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: colors.secondaryDark,
  },
  screen: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    backgroundColor: colors.primaryDark,
    flex: 1,
  },
  subtitle: {
    color: colors.secondaryDark,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 15,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    fontWeight: "bold",
  },
  text: {
    color: colors.secondaryDark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    alignSelf: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default AccountProfessorScreen;
