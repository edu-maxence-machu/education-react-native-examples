import React from 'react'
import {
  AsyncStorage, FlatList, StyleSheet, Text, TouchableOpacity,
  View,
} from 'react-native'
import BarCodeModal from '../modals/BarCodeModal'
import ProductModal from '../modals/ProductModal'
import Header from '../components/Header'
import Button from '../components/Button'
import { globalStyle, globalTextStyle } from '../styles/global'
import { getColorFromScore } from '../functions/product'

export default class Home extends React.Component {

  constructor(){
    super();

    /*
    Initial state
    Modals are closed and data empty
    History is loaded from {componentDidMount}
     */
    this.state = {
      modalScannerVisible: false,
      modalProductVisible: false,
      barCodeData: {},
      productData: {},
      history: [],
      loading: false,
    };
  };

  /**
   * ComponentDidMount can be async
   * Why here ? Because we wait to get the product history from AsyncStorage
   * @returns {Promise<void>}
   */
  componentDidMount = async () => {
    try {
      const history = await AsyncStorage.getItem('PDT_HISTORY');

      if (history !== null) {
        this.setState({history: JSON.parse(history)})
      } else {
        await AsyncStorage.setItem('PDT_HISTORY', JSON.stringify(this.state.history));
      }
    } catch (error)  {
      console.error(error);
    }
  }

  /**
   * <ProductModal/> & <BarCodeModal/> react to modal...Visible state
   * If state = true the modal opens
   * If state = false the modal closes
   * @param {boolean} visible
   */
  setModalScannerVisible(visible) {
    this.setState({modalScannerVisible: visible});
  }
  setModalProductVisible(visible) {
    this.setState({modalProductVisible: visible});
  }

  /**
   * Passed as prop to <BarCodeModal/>
   * Calls the OpenFoodFact API
   * Parameters are retrieved from Expo BarCodeScan component
   * @param type - Type of the scanned BarCode
   * @param data - Data of the scanned BarCode
   * @returns {Promise<void>}
   * @private
   */
  async _handleBarCodeRead ({ type, data }) {
    this.setState({barCodeData: data});
    this.setModalScannerVisible(false);

    // this function is async
    await this.getProductInfoFromApi(data);
  };

  getProductInfoFromApi = async (barCode) => {
    try {
      this.setState({loading : true});

      let response = await fetch(
        'https://fr.openfoodfacts.org/api/v0/produit/' + barCode + '.json'
      );
      let responseJson = await response.json();

      this.setStateAndOpenModal(responseJson.product);
      this.setState({loading : false});
      this.setModalProductVisible(true);

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
    this.setState({productData: data});
    this.setModalProductVisible(true);
  }

  /**
   * Set as props of <ProductModal/>
   * Called when user ask to save to product
   * @returns {Promise<void>}
   */
  saveProductAndQuitModal = async () => {
    this.setModalProductVisible(false);
    this.setState({loading : true});

    let history = this.state.history;
    history.push(this.state.productData);
    this.setState({history: history})

    try {
        await AsyncStorage.setItem('PDT_HISTORY', JSON.stringify(history));
        this.setState({loading : false});
    } catch (error)  {
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
        onPress={() => this.setStateAndOpenModal(el)}
        style={globalStyle.itemLine}>
        <Text style={[globalTextStyle.h2,
          {color: getColorFromScore(el.nutrition_grades)}]}>
          {el.product_name}
          </Text>

        <Text style={[globalTextStyle.subtitle, {marginBottom: 0}]}>
          {el.brands}
        </Text>
      </TouchableOpacity>
    )
  }

  /**
   * Clean AsyncStorage products history
   * And reset the state (history array)
   */
  resetCache = () => {
    AsyncStorage.removeItem('PDT_HISTORY');
    this.setState({history: []})
  }

  /**
   * Each item of a flatlist must have a key
   * See: https://facebook.github.io/react-native/docs/flatlist
   * @param item
   * @param index
   * @returns {string}
   * @private
   */
  _keyExtractor = (item, index) => index.toString();

  render() {
    return (
      <View style={styles.container}>
        <View style={globalStyle.statusBar} />

        <Header text={'Yoki'}/>


        {this.state.loading === true && <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>}

        <View style={[{flex: 1, padding: 10}]}>

          <BarCodeModal modalVisible={this.state.modalScannerVisible}
                        setModalVisible={(visible) => this.setModalScannerVisible(visible)}
                        handleBarCodeScanned={({type, data}) =>
                          this._handleBarCodeRead({type, data})}
          />

          <ProductModal modalVisible={this.state.modalProductVisible}
                        setModalVisible={(visible) => this.setModalProductVisible(visible)}
                        productData={this.state.productData}
                        saveAndQuit={this.saveProductAndQuitModal}
          />

          <Button
            onPress={() => {this.setModalScannerVisible(true)}}
            text="Scan a product"
          />

          <View style={styles.history}>
            <Text style={globalTextStyle.h1}>Previous Scans</Text>

            <FlatList contentContainerStyle={styles.scrollView}
                      style={{flex: 1}}
                      data={this.state.history}
                      renderItem={({item}) => this.renderItemHistory(item)}
                      keyExtractor={this._keyExtractor}
            />

            <TouchableOpacity onPress={this.resetCache}>
              <Text style={globalTextStyle.lightbutton}>Reset previous scans</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  text: {
    color: 'black',
    fontSize: 18
  },
  loading: {
    position: 'absolute',
    width: 100,
    top: '50%' - 50,
    left: '50%' - 50,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10
  },
  loadingText: {
    ...globalTextStyle.h1,
    color: 'white'
  },
  halfView : {
    height: '50%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  history : {
    flex: 1,
    marginTop: 20,
  },
  scrollView : {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10
  },
});
