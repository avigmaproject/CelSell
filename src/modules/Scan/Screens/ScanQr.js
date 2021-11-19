import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import QRCodeScanner from 'react-native-qrcode-scanner';
// import {RNCamera} from 'react-native-camera';
import HeaderBack from '../../../components/HeaderBack';

export default class ScanQr extends Component {
  constructor() {
    super();
    this.state = {
      appState: 'active',
    };
  }

  _getInitialUrl = async () => {
    const url = dynamicLinks().onLink(this.handleDynamicLink);
    this.setState({
      linkdata: url,
      photo: '',
      scan: false,
      ScanResult: false,
      result: '',
    });
  };
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this._getInitialUrl();
    }
  };
  handleDynamicLink = link => {
    if (link.url) {
      this.props.navigation.navigate('ShowBinData', {link: link.url});
    }
  };

  substring = () => {
    console.log(this.state.linkdata, 'substring');
  };
  componentDidMount = async () => {
    this.GetImage();
    this._getInitialUrl();
    this.substring();
    AppState.addEventListener('change', this._handleAppStateChange);
    await dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link) {
          console.log('Loginlink', link);
          this.props.navigation.navigate('ShowBinData', {link: link.url});
        }
        console.log('Loginlinklink', link);
      });
  };

  onSuccess = e => {
    const check = e.data.substring(0, 4);
    console.log('scanned data' + check);
    this.setState({
      result: e,
      scan: false,
      ScanResult: true,
    });
    if (check === 'http') {
      Linking.openURL(e.data).catch(err =>
        console.error('An error occured', err),
      );
    } else {
      this.setState({
        result: e,
        scan: false,
        ScanResult: true,
      });

      console.log(check, 'resultresult');
      this.props.navigation.navigate('ItemDetails', {check});
    }
  };

  GetImage = async () => {
    const imagepath = await AsyncStorage.getItem('imagepath');
    this.setState({photo: imagepath});
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <HeaderBack
          text="Scan"
          onPress={() => this.props.navigation.goBack()}
          onimageclick={() => this.props.navigation.navigate('MyProfile')}
          image={
            this.state.photo
              ? this.state.photo
              : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
          }
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            top: 10,
          }}>
          <Text style={styles.buttonText}>
            Scan a QR code to get bin details
          </Text>
        </View>

        <QRCodeScanner
          onRead={this.onSuccess}
          // flashMode={RNCamera.Constants.FlashMode.torch}
          // topContent={
          //   <Text style={styles.centerText}>
          //     Go to{' '}
          //     <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
          //     your computer and scan the QR code.
          //   </Text>
          // }
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
});
