import React, { useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { useQuery } from "@apollo/client";
//import { GROUPS } from "../gql/queries/getAllGroups";
import { APPOINTMENT } from "../gql/queries/getGroupAppointment";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import GroupAppointment from "../components/GroupAppointment";
import colors from "../config/colors";
import AuthContext from "../auth/context";

function HomeScreen(props) {
  const { user } = useContext(AuthContext);
  //APOLLO CLIENT
  const { data, loading, error, refetch } = useQuery(
    APPOINTMENT,
    {
      variables: {
        studentId: user.loginUser._id,
      },
    },
    {
      fetchPolicy: "network-only", // Doesn't check cache before making a network request
    }
  );

  useFocusEffect(() => {
    refetch();
  });

  if (error) {
    return <AppText>Error: {error.message}</AppText>; //while loading return this
  }

  if (loading) {
    return <AppText>Fetching data...</AppText>; //while loading return this
  }

  return (
    <Screen style={styles.notifBar}>
      <View style={styles.screen}>
        <AppText style={styles.title}>Upcoming Events</AppText>
        <GroupAppointment
          image={require("../assets/knightro.png")}
          title={dateToTimeString(data.getGroupAppointment.time)}
          profs={data.getGroupAppointment.attending2}
          room={data.getGroupAppointment.room}
          id={data.getGroupAppointment._id}
          onPress={() => console.log("Group selected", item)}
          style={styles.item}
        />
      </View>
    </Screen>
  );
}

function dateToTimeString(date) {
  if (date == null) return;
  var newDate = new Date(date);

  var hours = newDate.getHours();
  var AmOrPm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  var minutes = newDate.getMinutes();
  var finalTime = hours + ":" + minutes + "0 " + AmOrPm;

  return newDate.toDateString() + " at " + finalTime;
}

const styles = StyleSheet.create({
  item: {
    marginBottom: 5,
  },
  norifBar: {
    backgroundColor: colors.gold, //colors.primaryDark,
  },
  screen: {
    padding: 10,
    height: "100%",
    backgroundColor: colors.primaryDark,
  },
  title: {
    color: colors.secondaryDark,
    fontSize: 20,
    alignSelf: "center",
    paddingBottom: 80,
    paddingTop: 20,
  },
});

export default HomeScreen;
