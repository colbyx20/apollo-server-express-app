import { DefaultTheme } from "@react-navigation/native";
import styles from "../app/config/styles";

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: styles.colors.primaryDark,
    background: styles.colors.gold,
  },
};
