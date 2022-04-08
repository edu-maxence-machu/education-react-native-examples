//@flow
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
} from "react-native";
import {
  globalColors,
  globalStyle,
  globalTextStyle,
  HEADER_HEIGHT,
  textStyle,
} from "../styles/global";
import { FontAwesome } from "@expo/vector-icons";

const Header = ({ text, onClose }) => {
  let rightComponent = onClose ? (
    <TouchableOpacity style={styles.button} onPress={onClose}>
      <FontAwesome name={"window-close"} size={32} color={globalColors.white} />
    </TouchableOpacity>
  ) : null;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{text}</Text>

      {rightComponent}
    </SafeAreaView>
  );
};
export default Header;

const styles = StyleSheet.create({
  container: {
    ...globalStyle.header,
  },
  button: {
    position: "absolute",
    right: 0,
    top: 20,
    width: HEADER_HEIGHT,
    height: HEADER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    ...globalTextStyle.header,
  },
});
