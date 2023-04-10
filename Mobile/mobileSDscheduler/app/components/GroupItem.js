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

function GroupItem({
  title,
  subTitle,
  number,
  image,
  room,
  id,
  onPress,
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
            onPress={() => {
              onPress ? console.log(id) : setModalVisible(true);
            }}
          >
            <View style={[styles.container]}>
              <View>
                {image && <Image style={styles.image} source={image} />}
              </View>
              <View style={styles.details}>
                <AppText style={styles.number}>Group #{number}</AppText>
                <AppText style={styles.title}>{title}</AppText>
                <AppText style={styles.subTitle}>{subTitle}</AppText>
                <AppText style={styles.number}>Room: {room}</AppText>
              </View>
            </View>
          </TouchableHighlight>
          <AppointmentModal
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
    alignItems: "center",
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
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    alignSelf: "center",
  },
  number: {
    alignSelf: "flex-end",
    fontSize: 15,
    marginRight: 10,
    fontStyle: "italic",
  },
  subTitle: {
    color: colors.grayMedium,
    fontSize: 13,
    fontStyle: "italic",
  },
  title: {
    fontWeight: "600",
  },
});

export default GroupItem;
