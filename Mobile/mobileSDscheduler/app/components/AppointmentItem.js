import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  FlatList,
  Modal,
  Button,
} from "react-native";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import AppButton from "./AppButton";
import Screen from "./Screen";
import colors from "../config/colors";
import AppText from "./AppText";
import AvailabilityModal from "./AvailabilityModal";
import AppointmentModal from "./AppointmentModal";

function AppointmentItem({
  title,
  profs,
  coord,
  time,
  room,
  group,
  onPress,
  canSelect,
  renderRightActions,
  renderLeftActions,
  style,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  var numProfs = profs.length;
  return (
    <View style={style}>
      <GestureHandlerRootView>
        <Swipeable
          renderRightActions={renderRightActions}
          renderLeftActions={renderLeftActions}
        >
          <TouchableHighlight
            style={styles.highlight}
            underlayColor={colors.grayMedium}
            onPress={() => setModalVisible(true)}
          >
            <View style={[styles.container]}>
              <View style={styles.details}>
                <AppText style={styles.subTitle}>
                  Coordinator: {toUppercase(coord.coordinatorFName)}{" "}
                  {toUppercase(coord.coordinatorLName)}
                </AppText>
                <AppText style={styles.time}>
                  Time: {time.split(" ")[1]}
                </AppText>
                {0 < numProfs ? (
                  <AppText style={styles.subTitle}>Professors:</AppText>
                ) : (
                  <AppText style={styles.subTitle}>
                    No professors currently available
                  </AppText>
                )}
                <FlatList
                  data={profs}
                  keyExtractor={(data) => data._id.toString()}
                  renderItem={({ item }) => (
                    <AppText style={styles.professors}>
                      {toUppercase(item.fullName)}
                    </AppText>
                  )}
                />
                {group != null ? (
                  <AppText style={styles.subTitle}>
                    Group #{group.groupNumber}: {group.groupName}
                  </AppText>
                ) : (
                  <AppText style={styles.subTitle}>
                    No group currently assigned
                  </AppText>
                )}
                <AppText style={styles.time}>Room: {room}</AppText>
              </View>
            </View>
          </TouchableHighlight>
          {/* <AppointmentModal
            canSelect={canSelect}
            onPress={() => setModalVisible(false)}
            //THIS (appmtmdl) SHOULD BE DELETED, OTHERWISE CYCLE OCCURS
            modalVisible={modalVisible}
          ></AppointmentModal> */}
        </Swipeable>
      </GestureHandlerRootView>
    </View>
  );
}

function toUppercase(name) {
  const words = name.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1) + " ";
  }

  return words;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    //alignItems: "center",
    backgroundColor: colors.gold,
    borderRadius: 25,
    padding: 7,
  },
  details: {
    flex: 1,
  },
  highlight: {
    borderRadius: 25,
  },
  time: {
    alignSelf: "flex-end",
    fontSize: 15,
    marginRight: 10,
    fontStyle: "italic",
  },
  professors: {
    fontSize: 13,
    marginLeft: 25,
  },
  subTitle: {
    fontSize: 13,
    marginLeft: 10,
  },
});

export default AppointmentItem;
