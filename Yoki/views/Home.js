import React, { useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BarCodeModal from "../modals/BarCodeModal";
import ProductModal from "../modals/ProductModal";
import Header from "../components/Header";
import Button from "../components/Button";
import { globalStyle, globalTextStyle } from "../styles/global";
import { getColorFromScore } from "../functions/product";

export default function Home() {
  const [modalScannerVisible, setModalScannerVisible] = React.useState(false);
  const [modalProductVisible, setModalProductVisible] = React.useState(false);
  const [barCodeData, setBarCodeData] = React.useState({});
  const [productData, setProductData] = React.useState({});
  const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  /**
   * useEffect can be async
   * Why here ? Because we wait to get the product history from AsyncStorage
   * @returns {Promise<void>}
   */

  useEffect(() => {
    async () => {
      const history = await AsyncStorage.getItem("history");
      setHistory(JSON.parse(history) || []);
    };
    /*
    async function getHistory() {
      const history = await AsyncStorage.getItem("PDT_HISTORY");
      if (history !== null) {
        setHistory(JSON.parse(history));
      } else {
        await AsyncStorage.setItem("PDT_HISTORY", JSON.stringify(history));
      }
    }

    try {
      getHistory();
    } catch (e) {
      console.error(e);
    }*/
  });

  /**
   * Passed as prop to <BarCodeModal/>
   * Calls the OpenFoodFact API
   * Parameters are retrieved from Expo BarCodeScan component
   * @param type - Type of the sclanned BarCode
   * @param data - Data of the scanned BarCode
   * @returns {Promise<void>}
   * @private
   */
  async function _handleBarCodeRead({ type, data }) {
    setBarCodeData(data);
    setModalScannerVisible(false);

    // this function is async
    await getProductInfoFromApi(data);
  }

  async function getProductInfoFromApi(barCode) {
    try {
      setLoading(true);

      let response = await fetch(
        "https://fr.openfoodfacts.org/api/v0/produit/" + barCode + ".json"
      );
      let responseJson = await response.json();

      setStateAndOpenModal(responseJson.product);
      setLoading(false);
      setModalProductVisible(true);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Add the product to the productData state
   * And opens the <ProductModal/>
   * @param data
   */
  setStateAndOpenModal = (data) => {
    setProductData(data);
    setModalProductVisible(true);
  };

  /**
   * Set as props of <ProductModal/>
   * Called when user ask to save to product
   * @returns {Promise<void>}
   */
  async function saveProductAndQuitModal() {
    setModalProductVisible(false);
    setLoading(true);

    let _history = history;
    _history.push(productData);
    setHistory(_history);

    try {
      await AsyncStorage.setItem("PDT_HISTORY", JSON.stringify(history));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * This item is rendered from the FlatList component
   * @param el
   * @returns {*}
   */
  renderItemHistory = (el) => {
    return (
      <TouchableOpacity
        onPress={() => setStateAndOpenModal(el)}
        style={globalStyle.itemLine}
      >
        <Text
          style={[
            globalTextStyle.h2,
            { color: getColorFromScore(el.nutrition_grades) },
          ]}
        >
          {el.product_name}
        </Text>

        <Text style={[globalTextStyle.subtitle, { marginBottom: 0 }]}>
          {el.brands}
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Clean AsyncStorage products history
   * And reset the state (history array)
   */
  resetCache = () => {
    AsyncStorage.removeItem("PDT_HISTORY");
    setHistory([]);
  };

  /**
   * Each item of a flatlist must have a key
   * See: https://facebook.github.io/react-native/docs/flatlist
   * @param item
   * @param index
   * @returns {string}
   * @private
   */
  _keyExtractor = (item, index) => index.toString();

  return (
    <View style={styles.container}>
      <View style={globalStyle.statusBar} />

      <Header text={"Yoki"} />

      {loading === true && (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      <View style={[{ flex: 1, padding: 10 }]}>
        <BarCodeModal
          modalVisible={modalScannerVisible}
          setModalVisible={(visible) => setModalScannerVisible(visible)}
          handleBarCodeScanned={({ type, data }) =>
            _handleBarCodeRead({ type, data })
          }
        />

        <ProductModal
          modalVisible={modalProductVisible}
          setModalVisible={(visible) => setModalProductVisible(visible)}
          productData={productData}
          saveAndQuit={saveProductAndQuitModal}
        />

        <Button
          onPress={() => {
            setModalScannerVisible(true);
          }}
          text="Scan a product"
        />

        <View style={styles.history}>
          <Text style={globalTextStyle.h1}>Previous Scans</Text>

          <FlatList
            contentContainerStyle={styles.scrollView}
            style={{ flex: 1 }}
            data={history}
            renderItem={({ item }) => renderItemHistory(item)}
            keyExtractor={_keyExtractor}
          />

          <TouchableOpacity onPress={resetCache}>
            <Text style={globalTextStyle.lightbutton}>
              Reset previous scans
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  text: {
    color: "black",
    fontSize: 18,
  },
  loading: {
    position: "absolute",
    width: 100,
    top: "50%",
    left: "50%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 10,
  },
  loadingText: {
    ...globalTextStyle.h1,
    color: "white",
  },
  halfView: {
    height: "50%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  history: {
    flex: 1,
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
  },
});
