import React from "react";
import Constants from "expo-constants";
import { FlatList, StyleSheet, View, SafeAreaView } from "react-native";
import { useQuery } from "@apollo/client";
import { GROUPS } from "../gql/getAllGroups";
import {
  CalendarList,
  Calendar,
  Agenda,
  AgendaSchedule,
} from "react-native-calendars";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import GroupItem from "../components/GroupItem";
import GroupItemDeleteAction from "../components/GroupItemDeleteAction";
import GroupItemEditAction from "../components/GroupItemEditAction";
import colors from "../config/colors";

function CalendarScreen(props) {
  //APOLLO CLIENT
  const { data, loading, error } = useQuery(GROUPS);

  if (error) {
    return <AppText>Error: {error.message}</AppText>; //while loading return this
  }

  if (loading) {
    return <AppText>Fetching data...</AppText>; //while loading return this
  }

  //   console.log(data.getAllGroups[0].groupName);
  //   console.log(data);
  console.log(new Date().toLocaleString().split("T")[0]);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.titleContainer}>
        <AppText style={styles.title}>Calendar</AppText>
      </View>
      <Agenda
        // The list of items that have to be displayed in agenda. If you want to render item as empty date
        // the value of date key has to be an empty array []. If there exists no value for date key it is
        // considered that the date in question is not yet loaded
        items={{
          "2023-02-22": [{ name: "item 1 - any js object" }],
          "2023-02-23": [{ name: "item 2 - any js object", height: 80 }],
          "2023-02-24": [],
          "2023-02-25": [
            { name: "item 3 - any js object" },
            { name: "any js object" },
          ],
        }}
        //hideArrows={false}
        // Callback that gets called when items for a certain month should be loaded (month became visible)
        loadItemsForMonth={(month) => {
          console.log("trigger items loading");
        }}
        // Callback that fires when the calendar is opened or closed
        onCalendarToggled={(calendarOpened) => {
          console.log(calendarOpened);
        }}
        // Callback that gets called on day press
        onDayPress={(day) => {
          console.log("day pressed", day);
        }}
        // Callback that gets called when day changes while scrolling agenda list
        onDayChange={(day) => {
          console.log("day changed", day);
        }}
        // Initially selected day
        selected={new Date().toLocaleString().split("T")[0]} //"2023-02-23"
        // // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        // minDate={"2012-05-10"}
        // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        // maxDate={"2012-05-30"}
        //Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange={1}
        // Max amount of months allowed to scroll to the future. Default = 50
        futureScrollRange={12}
        // Specify how each item should be rendered in agenda
        renderItem={(item, firstItemInDay) => {
          return (
            <View style={styles.titleContainer}>
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
            </View>
          );
        }}
        // // Specify how each date should be rendered. day can be undefined if the item is not first in that day
        // renderDay={(day, item) => {
        //   return <View />;
        // }}
        // Specify how empty date content with no items should be rendered
        renderEmptyDate={() => {
          return (
            <View>
              <AppText>There are no appointents on this day</AppText>
            </View>
          );
        }}
        // // Specify how agenda knob should look like
        // renderKnob={() => {
        //   return <View />;
        // }}
        // Override inner list with a custom implemented component
        // renderList={(listProps) => {
        //   return <MyCustomList {...listProps} />;
        // }}
        // Specify what should be rendered instead of ActivityIndicator
        renderEmptyData={() => {
          return (
            <View>
              <AppText>There are no appointents on this day</AppText>
            </View>
          );
        }}
        // Specify your item comparison function for increased performance
        rowHasChanged={(r1, r2) => {
          return r1.text !== r2.text;
        }}
        // // Hide knob button. Default = false
        // hideKnob={true}
        // // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
        // showClosingKnob={false}
        // By default, agenda dates are marked if they have at least one item, but you can override this if needed
        // markedDates={{
        //   "2012-05-16": { selected: true, marked: true },
        //   "2012-05-17": { marked: true },
        //   "2012-05-18": { disabled: true },
        // }}
        // markedDates={{
        //   "2023-02-14": {
        //     periods: [
        //       { startingDay: false, endingDay: true, color: "#5f9ea0" },
        //       { startingDay: false, endingDay: true, color: "#ffa500" },
        //       { startingDay: true, endingDay: false, color: "#f0e68c" },
        //     ],
        //   },
        //   "2023-02-15": {
        //     periods: [
        //       { startingDay: true, endingDay: false, color: "#ffa500" },
        //       { color: "transparent" },
        //       { startingDay: false, endingDay: false, color: "#f0e68c" },
        //     ],
        //   },
        // }}
        // Agenda theme
        theme={{
          calendarBackground: "black", //agenda background
          //gendaKnobColor: "blue", // knob color
          backgroundColor: "black", // background color below agenda
          //agendaDayTextColor: "red", // day name
          //agendaDayNumColor: colors.secondaryDark, // day number
          agendaTodayColor: colors.primaryDark, // left number date
          monthTextColor: colors.secondaryDark, // Month and year in calendar
          textDefaultColor: "red",
          todayBackgroundColor: colors.primaryDark,
          textSectionTitleColor: colors.secondaryDark,
          selectedDayBackgroundColor: colors.gold, // calendar sel date
          dayTextColor: colors.secondaryDark, // this month's days
          dotColor: "white", // dots
          textDisabledColor: "red",
          reservationsBackgroundColor: colors.primaryDark,
        }}
        // Agenda container style
        style={{ backgroundColor: "red" }}
      ></Agenda>
      <View style={styles.titleContainer}>
        <AppText style={styles.title}>
          Just imagine this is a NavBar lol
        </AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  agenda: {
    backgroundColor: "red",
  },
  item: {
    marginBottom: 5,
  },
  screen: {
    padding: 10,
    backgroundColor: colors.primaryDark,
  },
  safeArea: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
  title: {
    color: colors.secondaryDark,
    fontSize: 20,
    alignSelf: "center",
    paddingBottom: 10,
    paddingTop: 20,
    backgroundColor: colors.primaryDark,
  },
  titleContainer: {
    backgroundColor: colors.primaryDark,
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});

export default CalendarScreen;
