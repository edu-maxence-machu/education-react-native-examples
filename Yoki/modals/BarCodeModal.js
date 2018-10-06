import React, { Component } from 'react'
import { Modal, Text, View } from 'react-native'
import { BarCodeScanner, Permissions } from 'expo'
import Header from '../components/Header'
import { globalStyle } from '../styles/global'

export default class ProductModal extends Component{
  constructor () {
    super()

    this.state = {
      hasCameraPermission: null,
    }
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  render () {
    const { hasCameraPermission } = this.state;

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
        visible={this.props.modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={{flex: 1}}>

          <View style={globalStyle.statusBar} />

          <Header text={'Yoki Scan App'}
                  onClose={() => this.props.setModalVisible(false)}/>

            <BarCodeScanner
              onBarCodeScanned={this.props.handleBarCodeScanned}
              style={{flex: 1}}
            />
        </View>
      </Modal>
    );
  }
}