import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Select, Toast} from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';

import HeaderBack from '../../../../components/HeaderBack';
import InputView from '../../Components/InputView';
import {
  getprofiles,
  getbins,
  getcsv,
  getpdf,
} from '../../../../services/api.function';

class Export extends Component {
  constructor() {
    super();
    this.state = {
      photo: '',
      loading: false,
      profile_Data: [],
      bin_Data: [],
      profile: null,
      bin: null,
      token: '',
      FilePath: '',
      excel: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.GetImage();
      this.getToken();
    });
  }

  componentWillUnmount() {
    this._unsubscribe;
  }

  GetImage = async () => {
    const imagepath = await AsyncStorage.getItem('imagepath');
    this.setState({photo: imagepath, loading: true});
  };

  GetProfile = async token => {
    this.setState({
      loading: true,
    });

    var data = JSON.stringify({
      Type: 3,
    });
    try {
      const res = await getprofiles(data, token);
      console.log('Profile', res[0]);
      this.setState({
        profile_Data: res[0],
        loading: false,
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      let message = '';
      if (error.response) {
        this.setState({
          loading: false,
        });
      } else {
        message = '';
      }
      console.log({message});
    }
  };

  GetBins = async () => {
    this.setState({
      loading: true,
    });
    var data = JSON.stringify({
      Bin_PkeyID: 1,
      Type: 3,
      Bin_PkeyID_Master: 1,
      Bin_PkeyID_Owner: this.state.profile,
    });
    console.log(data, 'binn');
    try {
      const res = await getbins(data, this.state.token);
      console.log(res, 'redsssssssssss');
      this.setState({
        bin_Data: res[0],
        loading: false,
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({
        loading: false,
      });
    }
  };

  getToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('token');
      this.setState({token});
      if (token) {
        this.GetProfile(token);
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
    }
  };

  getPDF = async () => {
    const {profile, bin} = this.state;
    this.setState({
      loading: true,
      excel: false,
    });
    var data = JSON.stringify({
      FilterType: profile ? 3 : 1,
      Type: 2,
      Pro_Bin_PkeyID: bin,
      User_PkeyID_Master: profile,
    });
    console.log(data, 'pdfData');
    try {
      const res = await getpdf(data, this.state.token);
      console.log(res, 'pdfresss');
      this.setState(
        {
          FilePath: res[0][0],
        },
        () => this.actualDownload(),
      );
      // this.showMessage('File Downloaded');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({
        loading: false,
      });
    }
  };

  getAllProfilePDF = async () => {
    console.log('AllProfile');
    this.setState({
      loading: true,
      excel: false,
    });
    var data = JSON.stringify({
      FilterType: 2,
      Type: 2,
    });
    console.log(data, 'AllData');
    try {
      const res = await getpdf(data, this.state.token);
      console.log(res[0][0], 'pdfresss');
      this.setState(
        {
          FilePath: res[0][0],
        },
        () => this.actualDownload(),
      );
      // this.showMessage('File Downloaded');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({
        loading: false,
      });
    }
  };

  getExcel = async () => {
    const {profile, bin} = this.state;
    this.setState({
      loading: true,
      excel: true,
    });
    var data = JSON.stringify({
      FilterType: profile ? 3 : 1,
      Type: 1,
      Pro_Bin_PkeyID: bin,
      User_PkeyID_Master: profile,
    });
    console.log(data, 'excelData');
    try {
      const res = await getcsv(data, this.state.token);
      console.log(res, 'excelresss');
      this.setState(
        {
          FilePath: res[0][0].ExcelPath,
        },
        () => this.actualDownload(),
      );
      // this.showMessage('File Downloaded');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({
        loading: false,
      });
    }
  };

  getAllProfileExcel = async () => {
    this.setState({
      loading: true,
      excel: true,
    });
    var data = JSON.stringify({
      FilterType: 2,
      Type: 1,
    });
    console.log(data, 'ExcelData');
    try {
      const res = await getcsv(data, this.state.token);
      console.log(res[0][0].ExcelPath, 'excelresss');
      this.setState(
        {
          FilePath: res[0][0].ExcelPath,
        },
        () => this.actualDownload(),
      );
      // this.showMessage('File Downloaded');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({
        loading: false,
      });
    }
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

  // actualDownload = async () => {
  //   const {FilePath, excel} = this.state;
  //   const {dirs} = RNFetchBlob.fs;
  //   if (Platform.OS === 'android') {
  //     const granted = await this.hasAndroidPermission();
  //     if (!granted) {
  //       return;
  //     }
  //   }
  //   const fs = RNFetchBlob.fs;
  //   RNFetchBlob.config({
  //     fileCache: true,
  //     addAndroidDownloads: {
  //       useDownloadManager: true,
  //       notification: true,

  //       path: excel
  //         ? `${dirs.DownloadDir}/test.xls`
  //         : `${dirs.DownloadDir}/test.pdf`,
  //       description: 'Downloading..',
  //     },
  //   })
  //     .fetch('GET', FilePath, {})
  //     .then(res => {
  //       console.log('The file saved to ', res.data);
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // };
  actualDownload = () => {
    const {FilePath, excel} = this.state;
    // console.log(FilePath, 'FilePath');
    const {dirs} = RNFetchBlob.fs;

    if (Platform.OS === 'android') {
      RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,

          path: excel
            ? `${dirs.DownloadDir}/test.xls`
            : `${dirs.DownloadDir}/test.pdf`,
          description: 'Downloading..',
        },
      })
        .fetch('GET', FilePath, {})
        .then(res => {
          console.log('The file saved to ', res.data);
          this.showMessage('File downloaded');
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      const configfb = {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        path: excel
          ? `${dirs.DocumentDir}/${FilePath}.xls`
          : `${dirs.DocumentDir}/${FilePath}.pdf`,
      };
      const configOptions = Platform.select({
        ios: {
          fileCache: configfb.fileCache,
          // title: configfb.title,
          path: configfb.path,
          // appendExt: excel ? 'xls' : 'pdf',
        },
      });
      RNFetchBlob.config(configOptions)
        .fetch('GET', FilePath, {})
        .then(res => {
          RNFetchBlob.ios.openDocument(res.data);
        })
        .catch(e => {
          console.log('The file saved to ERROR', e.message);
        });
    }
  };

  showMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      Toast.show({
        title: message,
        placement: 'bottom',

        duration: 5000,
        // backgroundColor: 'red.500',
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <View>
          <HeaderBack
            text="Export"
            onPress={() => this.props.navigation.goBack()}
            onimageclick={() => this.props.navigation.navigate('MyProfile')}
            image={
              this.props.profileImage
                ? this.props.profileImage
                : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
            }
          />
        </View>

        <Image
          source={require('../../../../assets/Image/Export.png')}
          style={{
            width: '45%',
            height: '30%',
            resizeMode: 'contain',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={{marginTop: 50, alignItems: 'center'}}>
            <Select
              dropdownIcon
              style={{
                fontSize: 14,
                paddingLeft: 20,
                color: '#000',
                height: 60,
                backgroundColor: '#fff',
              }}
              selectedValue={this.state.profile}
              width="90%"
              placeholder="Select the profile"
              onValueChange={itemValue =>
                this.setState({profile: itemValue}, () => this.GetBins())
              }
              _selectedItem={{
                bg: 'gray',
              }}>
              {this.state.profile_Data.map(item => {
                return (
                  <Select.Item
                    label={item.User_Name}
                    value={item.User_PkeyID}
                    key={item.User_PkeyID}
                  />
                );
              })}
            </Select>
          </View>
          <View style={{marginTop: 20, alignItems: 'center'}}>
            <Select
              dropdownIcon
              style={{
                fontSize: 14,
                paddingLeft: 20,
                color: '#000',
                height: 60,
                backgroundColor: '#fff',
              }}
              selectedValue={this.state.bin}
              width="90%"
              placeholder="Select the bin"
              onValueChange={itemValue => this.setState({bin: itemValue})}
              _selectedItem={{
                bg: 'gray',
              }}>
              {this.state.bin_Data.map(item => {
                return (
                  <Select.Item
                    label={item.Bin_Name}
                    value={item.Bin_PkeyID}
                    key={item.Bin_PkeyID}
                  />
                );
              })}
            </Select>
          </View>
          <View style={{marginTop: 50}}>
            <InputView
              text="EXPORT AS PDF"
              Image={require("'../../../../assets/Image/Pdf.png")}
              onPress={
                this.state.profile === null
                  ? () => this.getAllProfilePDF()
                  : () => this.getPDF()
              }
            />
          </View>
          <View style={{marginTop: 20}}>
            <InputView
              text="EXPORT AS CSV"
              Image={require("'../../../../assets/Image/Csv.png")}
              onPress={
                this.state.profile === null
                  ? () => this.getAllProfileExcel()
                  : () => this.getExcel()
              }
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  // access or fetch
  profileImage: state.authReducer.profileimage,
});

export default connect(mapStateToProps)(Export);
