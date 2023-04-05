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
  //APOLLO CLIENT
  const { data, loading, error } = useQuery(GROUPS);
  //   const [professors, setProfessors] = useState([
  //     { id: "" },
  //     { id: "" },
  //     { id: "" },
  //   ]);

  const [professors, setProfessors] = useState([]);

  if (error) {
    return <AppText>Error: {error.message}</AppText>; //while loading return this
  }

  if (loading) {
    return <AppText>Fetching data...</AppText>; //while loading return this
  }
  const onPressSave = () => {
    console.log("SAVED ", professors.toLocaleString());
  };

  const onPressAdd = () => {
    console.log("ADDED TO MY AVAILABILITY ", professors.toLocaleString());
  };

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

  return (
    <Modal visible={modalVisible} animationType="slide">
      <Screen style={styles.background}>
        {canSelect ? (
          <>
            <AppText style={styles.title}>Please select professors</AppText>
            <AppText style={styles.text}>
              Select professors for presentation:
            </AppText>
          </>
        ) : (
          <AppText style={styles.title}>
            Professors available at this time
          </AppText>
        )}
        <View style={styles.listContainer}>
          <FlatList
            data={data.getAllGroups}
            keyExtractor={(data) => data._id.toString()}
            renderItem={({ item }) => (
              <>
                <ProfessorItem
                  image={require("../assets/TheTab_KGrgb_300ppi.png")}
                  onPress={() => onPressItem(item._id)}
                  listIDs={professors.indexOf(item._id)}
                  name={item.groupName}
                  subTitle={item.projectField}
                  number={item.groupNumber}
                  id={item._id}
                  style={styles.item}
                />
                <View style={styles.divider}></View>
              </>
            )}
          />
        </View>
        <View style={styles.buttonContainer}>
          {canSelect ? (
            <AppButton
              title="Save"
              onPress={onPressSave} //{() => setModalVisible(false)}
            />
          ) : (
            <AppButton
              title="Add time"
              onPress={onPressAdd} //{() => setModalVisible(false)}
            />
          )}
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
