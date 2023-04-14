import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  Modal,
  Button,
  FlatList,
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
  profs,
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
                <AppText style={styles.title}>{title}</AppText>
                <FlatList
                  data={profs}
                  keyExtractor={(data) => data._id.toString()}
                  renderItem={({ item }) => (
                    <AppText style={styles.subTitle}>
                      {toUppercase(item.fullName)}
                    </AppText>
                  )}
                />
                {/* <AppText style={styles.subTitle}>{prof1}</AppText>
                <AppText style={styles.subTitle}>{prof2}</AppText>
                <AppText style={styles.subTitle}>{prof3}</AppText> */}
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
    color: colors.grayDark,
    fontSize: 15,
    fontStyle: "italic",
  },
  title: {
    fontWeight: "600",
    paddingTop: 10,
    paddingBottom: 5,
  },
});

export default GroupItem;
