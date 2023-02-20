import React from "react";
import { StyleSheet } from "react-native";

import AppText from "./AppText";
import styles from "../config/styles";

function ErrorMessage({ error, visible }) {
  if (!visible || !error) return null;
  return <AppText style={styles.error}>{error}</AppText>;
}

export default ErrorMessage;
