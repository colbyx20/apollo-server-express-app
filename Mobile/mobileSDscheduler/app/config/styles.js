import { Platform } from "react-native";

import colors from "./colors";

export default {
  colors,
  inputText: {
    color: colors.grayDark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    width: "100%",
  },
  text: {
    color: colors.grayDark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    alignSelf: "flex-start",
  },
  error: {
    color: "red",
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    alignSelf: "flex-start",
    fontWeight: "bold",
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    borderRadius: 5,
  },
};
