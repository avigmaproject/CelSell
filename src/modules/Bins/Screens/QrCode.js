import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Toast} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../../../components/HeaderBack';
import {FAB} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import {getbins} from '../../../services/api.function';

export default class QrCode extends Component {
  constructor() {
    super();
    this.state = {
      photo: '',
      result: '',
      id: null,
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', async () => {
      this.GetImage();
      this.GetBins();
      console.log(
        this.props.route.params.item.Bin_PkeyID,
        'this.props.route.params.item.Bin_PkeyID',
      );
      console.log(
        this.props.route.params.item.PkeyID,
        'this.props.route.params.item.PkeyID',
      );
    });
  }

  GetImage = async () => {
    const imagepath = await AsyncStorage.getItem('imagepath');
    this.setState({photo: imagepath});
  };

  showMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      Toast.show({
        title: message,
        placement: 'bottom',
        status: 'success',
        duration: 5000,
        // backgroundColor: 'red.500',
      });
    }
  };

  GetBins = async token => {
    this.setState({loading: true});
    var data = JSON.stringify({
      Bin_PkeyID: this.props.route.params.item.Bin_PkeyID
        ? this.props.route.params.item.Bin_PkeyID
        : this.props.route.params.item.PkeyID,
      Type: 2,
      Bin_PkeyID_Master: 1,
      Bin_PkeyID_Owner: 1,
    });
    console.log(data, 'qrdata');
    // try {
    const res = await getbins(data, token);
    console.log(res, 'redsssssssssss');
    // } catch (error) {
    //   this.setState({loading: false});
    //   console.log('hihihihihihih', {e: error.response.data.error});
    // }
  };

  async hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  handleDownload = async () => {
    if (Platform.OS === 'android') {
      const granted = await this.hasAndroidPermission();
      if (!granted) {
        return;
      }
    }
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
    })
      .fetch('GET', this.props.route.params.item.Bin_QR_PrintPath)
      .then(res => {
        CameraRoll.save(res.data, 'photo')
          .then(res => console.log(res))
          .catch(err => console.log(err));
      });
    this.showMessage('Image Saved in your gallery');
  };

  // handleDownload = async () => {
  //   if (Platform.OS === 'android') {
  //     const granted = await this.hasAndroidPermission();
  //     if (!granted) {
  //       return;
  //     }
  //   }
  //   RNFetchBlob.config({
  //     fileCache: true,
  //     appendExt: 'png',
  //   });
  //   CameraRoll.save(this.props.route.params.item.Bin_QR_PrintPath, 'photo');
  //   this.showMessage('Image Saved in your gallery');
  //   // }
  // };

  render() {
    const source = {
      uri: this.props.route.params.item.Bin_QR_PrintPath,
      cache: true,
    };
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        {/* <ScrollView> */}
        <HeaderBack
          text={this.props.route.params.item.Bin_Name}
          onPress={() => this.props.navigation.goBack()}
          onimageclick={() => this.props.navigation.navigate('MyProfile')}
          image={
            this.state.photo
              ? this.state.photo
              : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
          }
        />
        <View style={{alignItems: 'center', marginTop: 25}}>
          <Text
            style={{
              color: '#555555',
              fontSize: 24,
              lineHeight: 30,
              fontWeight: '600',
              textAlign: 'center',
              width: '80%',
            }}>
            Scan this QR code to get bin details
          </Text>
        </View>
        <View style={{alignItems: 'center', marginTop: 25}}>
          <Image
            style={{
              height: 350,
              width: 250,
            }}
            source={{
              uri: this.props.route.params.item.Bin_QR_Path
                ? this.props.route.params.item.Bin_QR_Path
                : this.props.route.params.item.QR_Path,
            }}
          />
        </View>
        <View style={{alignItem: 'center'}}>
          <FAB
            small
            icon="download"
            label="Save Qr"
            style={{
              position: 'absolute',
              // left: 20,
              top: 30,
              alignSelf: 'center',
              backgroundColor: '#BDBDBD',
            }}
            onPress={() => this.handleDownload()}
          />
        </View>
        {/* </ScrollView> */}
      </SafeAreaView>
    );
  }
}
