import React, { Component } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { globalStyle, globalTextStyle } from "../styles/global";
import Header from "../components/Header";
import { getColorFromLevel, getColorFromScore } from "../functions/product";

export default function BarCodeModal(props) {
  /**
   * React built in component : Alert
   */
  function exitModaAndAsk() {
    Alert.alert(
      "Save product ?",
      "Product will be saved in your localstorage",
      [
        { text: "Quit", onPress: () => props.setModalVisible(false) },
        { text: "Save & Quit", onPress: () => props.saveAndQuit() },
      ],
      { cancelable: false }
    );
  }

  let product = props.productData;
  console.log(product);

  /*
    Prevents error if Home.js state (productData) is empty
     */
  if (Object.keys(product).length === 0) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.modalVisible}
      onRequestClose={() => {}}
    >
      <View style={{ flex: 1 }}>
        <View style={globalStyle.statusBar} />

        <Header text={product.product_name} onClose={() => exitModaAndAsk()} />

        <ScrollView
          contentContainerStyle={styles.productInfoContainer}
          style={{ flex: 1 }}
        >
          <Text style={globalTextStyle.h1}>{product.product_name}</Text>
          <Text style={globalTextStyle.subtitle}>
            {product.brands.toUpperCase()}
          </Text>

          <Text
            style={[
              globalTextStyle.h2,
              { color: getColorFromScore(product.nutrition_grades) },
            ]}
          >
            Nutriscore is {product.nutrition_grades}
          </Text>

          <View style={styles.separator} />

          <Text style={globalTextStyle.h2}>Nutriment levels</Text>
          <View style={styles.nutrimentsContainer}>
            <Text
              style={[
                globalTextStyle.content,
                { color: getColorFromLevel(product.nutrient_levels.fat) },
              ]}
            >
              Fat {"\n"}
              {product.nutrient_levels.fat}
            </Text>

            <Text
              style={[
                globalTextStyle.content,
                { color: getColorFromLevel(product.nutrient_levels.salt) },
              ]}
            >
              Salt {"\n"}
              {product.nutrient_levels.salt}
            </Text>

            <Text
              style={[
                globalTextStyle.content,
                {
                  color: getColorFromLevel(
                    product.nutrient_levels["saturated-fat"]
                  ),
                },
              ]}
            >
              Satured-fat {"\n"}
              {product.nutrient_levels["saturated-fat"]}
            </Text>

            <Text
              style={[
                globalTextStyle.content,
                { color: getColorFromLevel(product.nutrient_levels.sugars) },
              ]}
            >
              Sugars {"\n"}
              {product.nutrient_levels.sugars}
            </Text>
          </View>

          <View style={styles.separator} />

          <Text style={globalTextStyle.h2}>Allergènes</Text>
          <Text style={globalTextStyle.content}> {product.allergens} </Text>

          <Text style={globalTextStyle.h2}>Ingredients</Text>
          <Text style={globalTextStyle.content}>
            {" "}
            {product.ingredients_text}{" "}
          </Text>

          <View style={styles.separator} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  nutrimentsContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  productInfoContainer: {
    flex: 1,
    padding: 40,
  },
  separator: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    height: 1,
  },
});
