import React, { Component, useEffect } from "react";
import { Modal, Text, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Header from "../components/Header";
import { globalStyle } from "../styles/global";

export default function ProductModal(props) {
  const [hasCameraPermission, setHasCameraPermission] = React.useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  if (hasCameraPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={globalStyle.statusBar} />

        <Header
          text={"Yoki Scan App"}
          onClose={() => props.setModalVisible(false)}
        />

        <BarCodeScanner
          onBarCodeScanned={props.handleBarCodeScanned}
          style={{ flex: 1 }}
        />
      </View>
    </Modal>
  );
}
