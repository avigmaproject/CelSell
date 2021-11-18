import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Select, Toast} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {FAB} from 'react-native-paper';
import HeaderBack from '../../../components/HeaderBack';
import InputText from '../../../components/InputText';
import Button from '../../../components/Button';
import {
  getlocation,
  createbin,
  uploadimage,
  updatebin,
  uploadqrimage,
} from '../../../services/api.function';

const options = [
  'Cancel',
  <View>
    <Text style={{color: 'black'}}>Gallery</Text>
  </View>,
  <Text style={{color: 'black'}}>Camera</Text>,
];

export default class CreateBin extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      name: '',
      photo: '',
      loading: false,
      location: '',
      base64: '',
      filename: 'image',
      imagepath: '',
      shelf: '',
      unit: '',
      binid: null,
      qrimage: '',
      userid: null,
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', async () => {
      this.GetImage();
      this.GetLocation();
      console.log(this.props.route.params.profile, 'this.props.params.profile');
    });
  }

  generateLink = async () => {
    const link = await dynamicLinks().buildShortLink({
      link: `https://cellsell.page.link/CreateUpdateBinMaster/${this.state.binid}`,
      domainUriPrefix: 'https://cellsell.page.link',
      // ios: {
      //   bundleId: "com.avigma.communv",
      //   appStoreId: "1579823021",
      //   fallbackUrl: "https://apps.apple.com/us/app/com.houseplant/id1535962213",
      // },
      android: {
        packageName: 'com.cellsell',
        fallbackUrl:
          'https://play.google.com/store/apps/details?id=com.cellsell',
      },
      navigation: {
        forcedRedirectEnabled: true,
      },
    });
    console.log(link);
    this.setState({link});
  };

  GetLocation = async () => {
    this.setState({loading: true});
    var data = JSON.stringify({
      Type: 1,
    });
    try {
      const res = await getlocation(data);
      this.setState({data: res[0]});
      this.setState({loading: false});
      console.log(res, 'ressssssss');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      let message = '';
      if (error.response) {
        setLoading(false);
      } else {
        message = '';
      }
      console.log({message});
    }
  };

  GetImage = async () => {
    const imagepath = await AsyncStorage.getItem('imagepath');
    this.setState({photo: imagepath, loading: true});
  };

  Validation = () => {
    let cancel = false;
    if (this.state.name.length === 0) {
      cancel = true;
    }
    if (this.state.location.length === 0) {
      cancel = true;
    }
    if (this.state.shelf.length === 0) {
      cancel = true;
    }
    if (this.state.unit.length === 0) {
      cancel = true;
    }
    if (cancel) {
      this.showerrorMessage('Fields can not be empty');
      return false;
    } else {
      return true;
    }
  };

  ImageValidation = () => {
    let cancel = false;
    if (!this.state.imagepath) {
      cancel = true;
    }
    if (cancel) {
      this.showerrorMessage('Upload Bin Image');
      return false;
    } else {
      return true;
    }
  };

  CreateBins = async () => {
    if (this.Validation() && this.ImageValidation()) {
      console.log(
        this.props.route.params.profile.User_PkeyID_Master,
        'this.props.route.params.profile.User_PkeyID_Master',
      );
      this.setState({loading: false});
      let data = {
        Bin_Name: this.state.name,
        Bin_Quantity: 1,
        Bin_IsActive: 1,
        Bin_IsDelete: 0,
        Type: 1,
        Bin_PkeyID_Master: 1,
        Bin_PkeyID_Owner: this.props.route.params.profile.User_PkeyID,
        Bin_Loc_ID: 1,
        Bin_Image_Path: this.state.imagepath,
        Bin_Unit: this.state.unit,
        Bin_Shelf: this.state.shelf,
        Loc_Name: this.state.location,
      };
      console.log(data, 'daatatatat');
      try {
        token = await AsyncStorage.getItem('token');
        const res = await createbin(data, token);
        console.log('ressssss:', res);
        this.setState({
          binid: res[0],
        });
        await this.generateLink();
        this.showMessage('Bin Added');
        this.setState({loading: false}, () => this.GenerateCode());
      } catch (error) {
        this.showerrorMessage(error.response.data.error_description);
      }
    }
  };

  UpdateBin = async () => {
    this.setState({loading: false});
    let data = {
      Bin_PkeyID: this.state.binid,
      Type: 5,
      Bin_QR_Path: this.state.qrimage,
    };
    try {
      token = await AsyncStorage.getItem('token');
      const res = await updatebin(data, token);
      console.log('updateressssssBinnnnnnnn:', res);
      this.setState({loading: false});
      this.props.navigation.navigate('HomeScreen');
    } catch (error) {
      this.showerrorMessage(error.response.data.error_description);
    }
  };

  onOpenImage = () => this.ActionSheet.show();

  ImageGallery = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      multiple: false,
      compressImageQuality: 0.5,
    }).then(image => {
      console.log(image);
      if (image.data) {
        this.setState(
          {
            base64: image.data,
            filename:
              Platform.OS === 'ios' ? images.filename : 'images' + new Date(),
            // imagepath: image.path,
          },
          () => {
            this.uploadImage();
          },
        );
      }
    });
  };

  ImageCamera = async () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      multiple: false,
      compressImageQuality: 0.5,
    }).then(image => {
      console.log(image);
      if (image.data) {
        this.setState(
          {
            base64: image.data,
            filename:
              Platform.OS === 'ios' ? images.filename : 'images' + new Date(),
            // imagepath: image.path,
          },
          () => {
            this.uploadImage();
          },
        );
      }
    });
  };

  uploadImage = async () => {
    this.setState({loading: true});
    const {base64} = this.state;
    let data = JSON.stringify({
      Type: 1,
      Image_Base: 'data:image/png;base64, ' + base64,
    });
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await uploadimage(data, token);
      // console.log(res[0].Image_Path, 'resssss');
      this.setState({
        imagepath: res[0].Image_Path,
      });
      this.setState({loading: false});
    } catch (error) {
      if (error.request) {
        console.log(error.request);
      } else if (error.responce) {
        console.log(error.responce);
      } else {
        console.log(error);
      }
    }
  };

  showerrorMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      Toast.show({
        title: message,
        placement: 'bottom',
        status: 'error',
        duration: 5000,
        // backgroundColor: 'red.500',
      });
    }
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

  warningMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      Toast.show({
        title: message,
        placement: 'bottom',
        status: 'warning',
        duration: 5000,
        // backgroundColor: 'red.500',
      });
    }
  };

  GenerateCode = async () => {
    this.setState({loading: true});
    const {link} = this.state;
    let data = JSON.stringify({
      QRCodeText: link,
      QRCodeHeigth: 1000,
      QRCodeWidth: 1000,
    });
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await uploadqrimage(data, token);
      this.setState({qrimage: res[0].QRCodeImagePath, loading: false}, () =>
        this.UpdateBin(),
      );
      console.log(res, 'qrres');
    } catch (error) {
      if (error.request) {
        console.log(error.request);
      } else if (error.responce) {
        console.log(error.responce);
      } else {
        console.log(error);
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <Spinner visible={this.state.loading} />
        <HeaderBack
          text="Create New Bin"
          onPress={() => this.props.navigation.goBack()}
          onimageclick={() => this.props.navigation.navigate('MyProfile')}
          image={
            this.state.photo
              ? this.state.photo
              : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
          }
        />
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{marginTop: 50}}>
            <InputText
              label="Enter name of the bin"
              onChangeText={name => this.setState({name: name})}
              value={this.state.name}
              placeholder="TryBin"
            />
          </View>
          <View style={{marginTop: 20, alignItems: 'center'}}>
            <Select
              dropdownIcon
              // isDisabled={editable}
              // variant="unstyled"
              style={{
                fontSize: 14,
                paddingLeft: 20,
                color: '#000',
                height: 55,
                backgroundColor: '#fff',
              }}
              selectedValue={this.state.location}
              width="90%"
              placeholder="Select Location"
              onValueChange={itemValue => this.setState({location: itemValue})}
              _selectedItem={{
                bg: 'gray',
              }}>
              {this.state.data.map(item => {
                return (
                  <Select.Item label={item.Loc_Name} value={item.Loc_ID} />
                );
              })}
            </Select>
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Enter Unit"
              onChangeText={unit => this.setState({unit: unit})}
              value={this.state.unit}
              placeholder="Enter Unit Number"
              keyboardType="numeric"
            />
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Enter Shelf"
              onChangeText={shelf => this.setState({shelf: shelf})}
              value={this.state.shelf}
              placeholder="Enter Shelf Number"
              keyboardType="numeric"
            />
          </View>
          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={
              <Text style={{color: '#000', fontSize: 18}}>Profile Photo</Text>
            }
            options={options}
            cancelButtonIndex={0}
            destructiveButtonIndex={4}
            useNativeDriver={true}
            onPress={index => {
              if (index === 0) {
                // cancel action
              } else if (index === 1) {
                this.ImageGallery();
              } else if (index === 2) {
                this.ImageCamera();
              }
            }}
          />
          <View>
            <FAB
              small
              icon="camera"
              label="Upload Bin Image"
              style={{
                position: 'absolute',
                left: 20,
                top: 30,
                backgroundColor: '#BDBDBD',
              }}
              onPress={() => this.onOpenImage()}
            />
            <View style={{position: 'absolute', right: 90, top: 30}}>
              <Image
                style={{
                  height: 45,
                  width: 45,
                  // borderRadius: 1,
                  // borderColor: '#BDBDBD',
                  // borderWidth: 1,
                }}
                source={{
                  uri: this.state.imagepath ? this.state.imagepath : null,
                }}
              />
            </View>
          </View>

          <View style={{marginTop: 100}}>
            <Button
              text="Save"
              backgroundColor="#6633FF"
              onPress={() => {
                this.CreateBins();
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
