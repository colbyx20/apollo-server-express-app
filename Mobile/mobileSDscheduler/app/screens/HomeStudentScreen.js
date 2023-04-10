import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client";
import { GROUPS } from "../gql/queries/getAllGroups";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import GroupItem from "../components/GroupItem";
import GroupItemDeleteAction from "../components/GroupItemDeleteAction";
import GroupItemEditAction from "../components/GroupItemEditAction";
import colors from "../config/colors";

function HomeScreen(props) {
  //APOLLO CLIENT
  const { data, loading, error } = useQuery(GROUPS);

  if (error) {
    return <AppText>Error: {error.message}</AppText>; //while loading return this
  }

  if (loading) {
    return <AppText>Fetching data...</AppText>; //while loading return this
  }

  // console.log(data.getAllGroups[0].groupName);
  // console.log(data);
  return (
    <Screen style={styles.screen}>
      <AppText style={styles.title}>Upcoming Events</AppText>
      <FlatList
        data={data.getAllGroups}
        keyExtractor={(data) => data._id.toString()}
        renderItem={({ item }) => (
          <GroupItem
            image={require("../assets/TheTab_KGrgb_300ppi.png")}
            title={item.groupName}
            subTitle={item.projectField}
            number={item.groupNumber}
            onPress={() => console.log("Group selected", item)}
            renderRightActions={(itemObject) => (
              <GroupItemDeleteAction
                onPress={(itemOBject) => console.log("deleted", item)}
              />
            )}
            renderLeftActions={(itemObject) => (
              <GroupItemEditAction
                onPress={(itemObject) => console.log("edited", item)}
              />
            )}
            style={styles.item}
          />
        )}
      />
    </Screen>
  );
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
