import React, { useState } from "react";
import Constants from "expo-constants";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { useQuery } from "@apollo/client";
import { APPOINTMENTS } from "../gql/queries/getAllCoordinatorScheduleFancy";
import { Agenda } from "react-native-calendars";

import AppText from "../components/AppText";
import AppointmentItem from "../components/AppointmentItem";
import AvailabilityModal from "../components/AvailabilityModal";
import colors from "../config/colors";
import TitleBar from "../components/TitleBar";

function CalendarStudentScreen(props) {
  //APOLLO CLIENT
  const { data, loading, error } = useQuery(APPOINTMENTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [currDay, setCurrDay] = useState(0);
  const [currDate, setCurrDate] = useState("");

  if (error) {
    return <AppText>Error: {error.message}</AppText>; //while loading return this
  }

  if (loading) {
    return <AppText>Fetching data...</AppText>; //while loading return this
  }

  //console.log(mapAppmntList(data.getAllCoordinatorScheduleFancy));
  return (
    <SafeAreaView style={styles.safeArea}>
      <TitleBar
        title={"Availabilities"}
        onPressLeft={() => console.log("goBack")}
        onPressRight={() => setModalVisible(true)}
      />
      <Agenda
        // The list of items that have to be displayed in agenda. If you want to render item as empty date
        // the value of date key has to be an empty array []. If there exists no value for date key it is
        // considered that the date in question is not yet loaded
        items={mapAppmntList(data.getAllCoordinatorScheduleFancy)}
        showOnlySelectedDayItems={true}
        // Callback that gets called when items for a certain month should be loaded (month became visible)
        loadItemsForMonth={(month) => {
          //console.log("trigger items loading");
        }}
        // Callback that fires when the calendar is opened or closed
        onCalendarToggled={(calendarOpened) => {
          //console.log(calendarOpened);
        }}
        animateScroll={false}
        // Callback that gets called on day press
        onDayPress={(day) => {
          //console.log("day pressed", day);
          setCurrDay((new Date(day.dateString).getDay() + 1) % 7);
          setCurrDate(day.dateString);
        }}
        // Callback that gets called when day changes while scrolling agenda list
        onDayChange={(day) => {
          setCurrDay((new Date(day.dateString).getDay() + 1) % 7);
          //console.log("day changed", day);
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
        futureScrollRange={5}
        // Specify how each item should be rendered in agenda
        renderItem={(item, firstItemInDay) => {
          //itemInfo = item.info;
          //console.log("DATETIME= ", itemInfo.datetime);
          return (
            <View style={styles.titleContainer}>
              <AppointmentItem
                time={item.datetime}
                canSelect={false}
                profs={item.attending}
                room={item.room}
                coord={item.coordinator[0]}
                group={item.group[0]}
                onPress={() => console.log("Group selected", item)}
                style={styles.item}
              />
            </View>
          );
        }}
        // Specify how empty date content with no items should be rendered
        renderEmptyDate={() => {
          return (
            <View>
              <AppText>There are no appointents on this day</AppText>
            </View>
          );
        }}
        // Specify what should be rendered instead of ActivityIndicator
        renderEmptyData={() => {
          return (
            <View style={styles.emptyDay}>
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
        // Agenda theme
        theme={{
          // "stylesheet.agenda.list": { container: { backgroundColor: "red" } },
          "stylesheet.agenda.list": {
            reservations: { backgroundColor: "red" },
          },
          "stylesheet.agenda.list": { backgroundColor: "red" },
          calendarBackground: colors.primaryDark, //"black", //agenda background
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
          textDisabledColor: colors.grayMedium, //"red",
          reservationsBackgroundColor: colors.primaryDark,
          // contentStyle: "red",
          // event: "red",
          line: "red",
          timelineContainer: "red",
          //agendaDayNumColor: "red", //left agenda day color
          //agendaDayTextColor: "green", //left agenda name color
          //agendaKnobColor: "blue",
          agendaTodayColor: "yellow",
        }}
        // Agenda container style
        style={{
          backgroundColor: colors.primaryDark,
        }}
      ></Agenda>
      <AvailabilityModal
        onPress={() => setModalVisible(false)}
        dayIndex={currDate == "" ? getIndex(new Date()) : currDay}
        dateString={
          currDate == "" ? new Date().toISOString().split("T")[0] : currDate
        }
        modalVisible={modalVisible}
      ></AvailabilityModal>
    </SafeAreaView>
  );
}

function getIndex(date) {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var currDayName = date.toLocaleString().split(" ")[0];
  return days.indexOf(currDayName);
}

function mapAppmntList(appointents) {
  var list = [];
  appointents.forEach((item) => list.push(mapAppmntDay(item)));
  let output = {};
  var len = list.length;
  for (var i = 0; len > i; i++) {
    output[Object.keys(list[i])] = Object.values(list[i])[0];
  }
  return output;
}

function mapAppmntDay({ _id, info }) {
  var date = new Date(_id).toISOString().split("T")[0];
  var key = date,
    day = {
      [key]: info,
    };
  return day;
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
  emptyDay: {
    fontSize: 15,
    alignSelf: "center",
    borderRadius: 25,
    padding: 10,
    backgroundColor: colors.gold,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});

export default CalendarStudentScreen;
