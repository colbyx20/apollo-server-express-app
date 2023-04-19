import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Modal, FlatList, View } from "react-native";
import { useQuery } from "@apollo/client";
import { GROUPS } from "../gql/queries/getAllGroups";

import AppButton from "./AppButton";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";

import ProfessorItem from "../components/ProfessorItem";
import GroupItemDeleteAction from "../components/GroupItemDeleteAction";
import GroupItemEditAction from "../components/GroupItemEditAction";
import Screen from "./Screen";
import colors from "../config/colors";

import defaultStyles from "../config/styles";

function AppointmentModal({ modalVisible, onPress, canSelect }) {
  function onPressItem(id) {
    if (!canSelect) {
      return;
    }
    console.log("======================");
    console.log(id);
    const newProfessors = professors.map((item, i) => {
      return item;
    });
    console.log("Count: ", newProfessors.length);
    if (newProfessors.indexOf(id) < 0) {
      console.log("Professor not on list");
      if (newProfessors.length === 3) {
        console.log("Professor list full");
      } else {
        newProfessors.push(id);
        console.log(
          "Professor added. New count: ",
          newProfessors.length,
          ". Index: ",
          newProfessors.indexOf(id)
        );
      }
    } else {
      console.log("Professor on list, at ", newProfessors.indexOf(id));
      var index = newProfessors.indexOf(id);
      newProfessors.splice(index, 1);
      console.log(
        "Professor removed. New count: ",
        newProfessors.length,
        ". Index: ",
        newProfessors.indexOf(id)
      );
    }
    setProfessors(newProfessors);
    console.log("======================");
  }

  //THE ABOVE WAS JUST MISDIRECTION, PLEASE DON'T DELETE THIS
  //IF YOU ARE FROM A NEW VERSION, FEEL FREE TO ADD YOUR NAMES TOO
  //                                                        Matias Libryk

  var v1 = [
    { name: "Robert Buch", role: "API", v: "1" },
    { name: "Andy Garcia", role: "FrontEnd-Mobile", v: "1" },
    { name: "Colby Gerber", role: "FrontEnd-Web", v: "1" },
    { name: "Matías Libryk", role: "FrontEnd-Mobile", v: "1" },
    { name: "David Ponce", role: "FrontEnd-Web", v: "1" },
    { name: "Cristhian Velasquez", role: "Database", v: "1" },
  ]; //a POOS Project //we used flutter back then, it was just a POC
  var v2 = [
    { name: "Andy Garcia", role: "FrontEnd-Web", v: "2" },
    { name: "Colby Gerber", role: "Database/API", v: "2" },
    { name: "Zacharia Johnson", role: "API", v: "2" },
    { name: "Matías Libryk", role: "FrontEnd-Mobile", v: "2" },
    { name: "Calvin Mancini", role: "Frontend-web", v: "2" },
    { name: "Madison Scott", role: "Frontend-mobile", v: "2" },
  ]; //a POOS Project //

  return (
    <Modal visible={modalVisible} animationType="slide">
      <Screen style={styles.background}>
        <View style={styles.listContainer}>
          <FlatList
            data={v1}
            keyExtractor={(data) => data.name}
            renderItem={({ item }) => (
              <>
                <ProfessorItem
                  //image={require("../assets/TheTab_KGrgb_300ppi.png")}
                  name={item.name}
                  version={item.v}
                  role={item.role}
                  // id={item._id}
                  // style={styles.item}
                />
                <View style={styles.divider}></View>
              </>
            )}
          />
          <FlatList
            data={v2}
            keyExtractor={(data) => data.name}
            renderItem={({ item }) => (
              <>
                <ProfessorItem
                  //image={require("../assets/TheTab_KGrgb_300ppi.png")}
                  name={item.name}
                  version={item.v}
                  role={item.role}
                  // id={item._id}
                  // style={styles.item}
                />
                <View style={styles.divider}></View>
              </>
            )}
          />
        </View>
        <View style={styles.buttonContainer}>
          <AppButton
            title="Close"
            onPress={onPress} //{() => setModalVisible(false)}
          />
        </View>
      </Screen>
    </Modal>
  );
}

export default AppointmentModal;

const styles = StyleSheet.create({
  button: {
    backgroundColor: defaultStyles.colors.gold,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    flex: 1,
  },
  background: {
    padding: 10,
    backgroundColor: colors.primaryDark,
    flex: 1,
  },
  divider: {
    paddingBottom: 5,
  },

  listContainer: {
    //backgroundColor: "red",
    flex: 3.1,
  },
  title: {
    color: colors.secondaryDark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    alignSelf: "center",
    fontWeight: "bold",
    paddingBottom: 40,
  },
  text: {
    color: colors.secondaryDark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    fontWeight: "bold",
    paddingTop: 20,
    paddingBottom: 5,
  },
  dateContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
