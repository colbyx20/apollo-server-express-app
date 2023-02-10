import { Platform } from "react-native";

import colors from "./colors";

export default{
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
    },
}