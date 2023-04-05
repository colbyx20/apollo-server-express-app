import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, StyleSheet } from "react-native";
import { useQuery, useLazyQuery } from "@apollo/client";
//import { GROUPS } from "../gql/queries/getAllGroups";
import { GROUPS } from "../gql/queries/getProfessorsAppointments";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import GroupItem from "../components/GroupItem";
import GroupItemDeleteAction from "../components/GroupItemDeleteAction";
import GroupItemEditAction from "../components/GroupItemEditAction";
import colors from "../config/colors";

function HomeScreen(props) {
  //APOLLO CLIENT
  const { data, loading, error, refetch } = useQuery(
    GROUPS,
    {
      variables: { profId: "6414996286c77fadcb080900" },
    },
    {
      fetchPolicy: "network-only", // Doesn't check cache before making a network request
    }
  );

  useFocusEffect(() => {
    console.log("Refetch");
    refetch();
  });

  if (error) {
    return <AppText>Error: {error.message}</AppText>; //while loading return this
  }

  if (loading) {
    return <AppText>Fetching data...</AppText>; //while loading return this
  }

  // console.log(data.getAllGroups[0].groupName);
  //console.log(data);
  console.log(data);

  return (
    <Screen style={styles.screen}>
      <AppText style={styles.title}>Upcoming Events</AppText>
      <FlatList
        data={data.getProfessorsAppointments}
        keyExtractor={(data) => data._id.toString()}
        renderItem={({ item }) => (
          <GroupItem
            image={require("../assets/TheTab_KGrgb_300ppi.png")}
            title={item.groupName}
            subTitle={dateToTimeString(item.time)}
            room={item.room}
            number={item.groupNumber}
            id={item._id}
            onPress={() => console.log("Group selected", item)}
            renderRightActions={(itemObject) => (
              <GroupItemDeleteAction
                onPress={(itemOBject) => console.log("deleted", item)}
              />
            )}
            renderLeftActions={(itemObject) => (
              <GroupItemDeleteAction
                onPress={(itemOBject) => console.log("deleted", item)}
              />
            )}
            // renderLeftActions={(itemObject) => (
            //   <GroupItemEditAction
            //     onPress={(itemObject) => console.log("edited", item)}
            //   />
            // )}
            style={styles.item}
          />
        )}
      />
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
  screen: {
    padding: 10,
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
