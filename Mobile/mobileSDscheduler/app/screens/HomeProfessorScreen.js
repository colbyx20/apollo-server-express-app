import React, { useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, StyleSheet, View } from "react-native";
import { useQuery, useMutation } from "@apollo/client";
import { GROUPS } from "../gql/queries/getProfessorsAppointments";
import { CANCEL_APPOINTMENT } from "../gql/mutations/cancelAppointment";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import GroupItem from "../components/GroupItem";
import GroupItemDeleteAction from "../components/GroupItemDeleteAction";
import colors from "../config/colors";
import AuthContext from "../auth/context";

function HomeScreen(props) {
  const { user } = useContext(AuthContext);
  //APOLLO CLIENT
  const { data, loading, error, refetch } = useQuery(
    GROUPS,
    {
      variables: { profId: user.loginUser._id },
    },
    {
      fetchPolicy: "network-only", // Doesn't check cache before making a network request
    }
  );
  const [cancelAppointment] = useMutation(CANCEL_APPOINTMENT);

  useFocusEffect(() => {
    refetch();
  });

  function handlePress(item) {
    cancelAppointment({
      variables: {
        cancelation: {
          ApID: item._id,
          CancelerID: user.loginUser._id,
          reason: null,
          // room: item.room,
          // time: item.time,
        },
      },
    });
    console.log("deleted", item);
  }

  if (error) {
    return <AppText>Error: {error.message}</AppText>; //while loading return this
  }

  if (loading) {
    return <AppText>Fetching data...</AppText>; //while loading return this
  }

  return (
    <Screen style={styles.norifBar}>
      <View style={styles.screen}>
        <AppText style={styles.title}>Upcoming Events</AppText>
        <FlatList
          data={data.getProfessorsAppointments}
          keyExtractor={(data) => data._id.toString()}
          renderItem={({ item }) => (
            <GroupItem
              image={require("../assets/knightro.png")}
              title={item.groupName}
              subTitle={dateToTimeString(item.time)}
              room={item.room}
              number={item.groupNumber}
              id={item._id}
              onPress={() => console.log("Group selected", item)}
              renderRightActions={(itemObject) => (
                <GroupItemDeleteAction onPress={() => handlePress(item)} />
              )}
              renderLeftActions={(itemObject) => (
                <GroupItemDeleteAction onPress={() => handlePress(item)} />
              )}
              style={styles.item}
            />
          )}
        />
      </View>
    </Screen>
  );
}

function dateToTimeString(date) {
  if (date == null) return;
  var year = date.split("/")[2].split(" ")[0];
  var month = date.split("/")[0] - 1;
  var day = date.split("/")[1];
  var hour = date.split(" ")[1].split(":")[0];
  var newDated = date.split(" ")[1].split(":")[1];
  var newDate = new Date(Date.UTC(year, month, day, hour));

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
