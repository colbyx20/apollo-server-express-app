import React from "react";
import Constants from "expo-constants";
import { FlatList, StyleSheet, View, SafeAreaView, Image } from "react-native";
import { useQuery } from "@apollo/client";
import { GROUPS } from "../gql/getAllGroups";
import {
  CalendarList,
  Calendar,
  Agenda,
  AgendaSchedule,
} from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import AppointmentItem from "../components/AppointmentItem";
import GroupItem from "../components/GroupItem";
import GroupItemDeleteAction from "../components/GroupItemDeleteAction";
import GroupItemEditAction from "../components/GroupItemEditAction";
import colors from "../config/colors";
import TitleBar from "../components/TitleBar";

function CalendarStudentScreen(props) {
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
      <TitleBar title="Availabilities" />
      <Agenda
        // The list of items that have to be displayed in agenda. If you want to render item as empty date
        // the value of date key has to be an empty array []. If there exists no value for date key it is
        // considered that the date in question is not yet loaded
        items={{
          // "2023-03-14": [{ name: "item 1 - any js object" }],
          // "2023-03-23": [
          //   {
          //     name: "item 2 - any js object",
          //     height: 80,
          //     groupName: "SD Scheduler",
          //     projectField: "IT",
          //     groupNumber: "1",
          //   },
          // ],
          "2023-03-16": [
            {
              _id: "1234567890",
              arrayLength: 3,
              pId: [
                { _id: 123, name: "abc" },
                { _id: 223, name: "bbc" },
                { _id: 323, name: "cbc" },
              ],
            },
            {
              _id: "0987654321",
              arrayLength: 5,
              pId: [
                { _id: 123, name: "abc" },
                { _id: 223, name: "bbc" },
                { _id: 323, name: "cbc" },
                { _id: 233, name: "bbc" },
                { _id: 333, name: "cbc" },
              ],
            },
          ],
          // "2023-03-22": [
          //   {
          //     _id: "1234567890",
          //     arrayLength: 5,
          //     pId: [
          //       { _id: 123, name: "abc" },
          //       { _id: 223, name: "bbc" },
          //       { _id: 323, name: "cbc" },
          //       { _id: 233, name: "bbc" },
          //       { _id: 333, name: "cbc" },
          //     ],
          //   },
          // ],

          // "2023-03-24": [],
          // "2023-03-25": [
          //   { name: "item 3 - any js object" },
          //   { name: "any js object" },
          // ],
        }}
        // Callback that gets called when items for a certain month should be loaded (month became visible)
        loadItemsForMonth={(month) => {
          console.log("trigger items loading");
        }}
        // Callback that fires when the calendar is opened or closed
        onCalendarToggled={(calendarOpened) => {
          console.log(calendarOpened);
        }}
        animateScroll={false}
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
              <AppointmentItem
                time={item._id}
                canSelect={true}
                prof1={item.pId[0].name}
                prof2={item.pId[1].name}
                prof3={item.pId[2].name}
                numProf={item.arrayLength}
                onPress={() => console.log("Group selected", item)}
                // renderRightActions={(itemObject) => (
                //   <GroupItemDeleteAction
                //     onPress={(itemOBject) =>
                //       console.log("ADD TO MY AVAILABILITY", item)
                //     }
                //   />
                // )}
                // renderLeftActions={(itemObject) => (
                //   <GroupItemEditAction
                //     onPress={(itemObject) =>
                //       console.log("ADD TO MY AVAILABILITY", item)
                //     }
                //   />
                // )}
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
        showClosingKnob={true}
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
          // "stylesheet.agenda.list": { container: { backgroundColor: "red" } },
          "stylesheet.agenda.list": {
            reservations: { backgroundColor: "red" },
          },
          "stylesheet.agenda.list": { backgroundColor: "red" },
          calendarBackground: "black", //agenda background
          //gendaKnobColor: "blue", // knob color
          backgroundColor: "black", // background color below agenda
          //agendaDayTextColor: "red", // day name
          //agendaDayNumColor: colors.secondaryDark, // day number
          agendaTodayColor: colors.primaryDark, // left number date
          monthTextColor: colors.secondaryDark, // Month and year in calendar
          textDefaultColor: "red",
          todayBackgroundColor: colors.secondaryDark, //today's color
          todayTextColor: colors.primaryDark,
          textSectionTitleColor: colors.secondaryDark, //day name color
          selectedDayBackgroundColor: colors.gold, // selected day color background
          selectedDayTextColor: colors.primaryDark, //selected day color text
          dayTextColor: colors.secondaryDark, // this month's days
          dotColor: "white", // dots
          textDisabledColor: "red",
          reservationsBackgroundColor: colors.primaryDark,
          // contentStyle: "red",
          // event: "red",
          line: "red",
          timelineContainer: "red",
          agendaDayNumColor: "red", //left agenda day color
          agendaDayTextColor: "green", //left agenda name color
          agendaKnobColor: "blue",
          agendaTodayColor: "yellow",
        }}
        // Agenda container style
        style={{
          backgroundColor: colors.primaryDark,
        }}
      ></Agenda>
      <View>
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
    backgroundColor: colors.gold, //colors.primaryDark,
    flex: 1,
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

export default CalendarStudentScreen;
