import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
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
  numProf,
  prof1,
  prof2,
  prof3,
  time,
  onPress,
  canSelect,
  renderRightActions,
  renderLeftActions,
  style,
}) {
  const [modalVisible, setModalVisible] = useState(false);
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
                <AppText style={styles.time}>Time: {time}</AppText>
                <AppText style={styles.professors}>
                  {prof1}, {prof2}, {numProf === 3 ? "and " : ""}
                  {prof3}
                  {3 < numProf ? ", ..." : ""}{" "}
                </AppText>
              </View>
            </View>
          </TouchableHighlight>
          <AppointmentModal
            canSelect={canSelect}
            onPress={() => setModalVisible(false)}
            //THIS (appmtmdl) SHOULD BE DELETED, OTHERWISE CYCLE OCCURS
            modalVisible={modalVisible}
          ></AppointmentModal>
        </Swipeable>
      </GestureHandlerRootView>
    </View>
  );
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
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default AppointmentItem;
