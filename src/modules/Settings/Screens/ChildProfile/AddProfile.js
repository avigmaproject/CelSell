import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {FAB} from 'react-native-paper';
import {Select, Toast} from 'native-base';
import DropDownPicker from 'react-native-dropdown-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderBack from '../../../../components/HeaderBack';
import InputText from '../../../../components/InputText';
import Button from '../../../../components/Button';
import {verifyEmail} from '../../../Auth/miscellaneous/miscellaneous.configure';
import {
  getlocation,
  uploadimage,
  addprofile,
} from '../../../../services/api.function';
// import DropDown from '../../../../components/DropDown';

const options = [
  'Cancel',
  <View>
    <Text style={{color: 'black'}}>Gallery</Text>
  </View>,
  <Text style={{color: 'black'}}>Camera</Text>,
];

export default class AddProfile extends Component {
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
      email: '',
      value: null,
      items: [],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', async () => {
      this.GetImage();
      this.GetLocation();
    });
  }

  GetImage = async () => {
    this.setState({
      photo: await AsyncStorage.getItem('imagepath'),
    });
  };

  Validation = () => {
    let cancel = false;
    const {name, email, location, imagepath} = this.state;
    if (name.length === 0) {
      cancel = true;
    }
    if (email.length === 0) {
      cancel = true;
    }
    if (location.length === 0) {
      cancel = true;
    }

    if (cancel) {
      this.showerrorMessage('Fields can not be empty');
      return false;
    } else {
      return true;
    }
  };

  checkEmail = email => {
    let cancel = false;
    if (verifyEmail(email)) {
      cancel = true;
      this.warningMessage('Please enter valid email');
    }
    if (cancel) {
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
      this.showerrorMessage('Upload Image');
      return false;
    } else {
      return true;
    }
  };

  AddProfile = async () => {
    const {email, name, imagepath, location} = this.state;
    if (this.Validation() && this.checkEmail(email) && this.ImageValidation()) {
      this.setState({
        loading: true,
      });
      let data = {
        User_Email: email,
        User_Name: name,
        User_Image_Path: imagepath,
        User_Address: location,
        Type: 7,
      };
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await addprofile(data, token);
        console.log('ressssss:', res);
        this.showMessage('Profile Added');
        this.props.navigation.navigate('Profiles');
        this.setState({
          loading: false,
        });
      } catch (error) {
        this.showerrorMessage(error.response.data.error_description);
      }
    }
  };

  GetLocation = async () => {
    this.setState({
      loading: true,
    });
    var data = JSON.stringify({
      Type: 1,
    });
    try {
      const res = await getlocation(data);
      this.setState({
        data: res[0],
        loading: false,
      });

      console.log(res, 'ressssssss');
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
      });
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

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <Spinner visible={this.state.loading} />
        <HeaderBack
          text="Add Profiles"
          onPress={() => this.props.navigation.goBack()}
          onimageclick={() => this.props.navigation.navigate('MyProfile')}
          image={
            this.state.photo
              ? this.state.photo
              : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
          }
        />
        <View style={{marginTop: 30}}>
          <InputText
            label="Name"
            onChangeText={name => this.setState({name: name})}
            value={this.state.name}
            placeholder="Enter your Name"
          />
        </View>
        <View style={{marginTop: 20}}>
          <InputText
            label="Email"
            onChangeText={email => this.setState({email: email})}
            value={this.state.email}
            placeholder="Enter your Emal ID"
          />
        </View>
        <View style={{marginTop: 20, alignItems: 'center'}}>
          <Select
            dropdownIcon
            // isDisabled={editable}
            // variant="unstyled"
            style={{
              // borderWidth: 0,
              fontSize: 14,
              paddingLeft: 20,
              color: '#000',
              height: 55,
              backgroundColor: '#fff',
            }}
            selectedValue={this.state.location}
            width="90%"
            // accessibilityLabel="Select your favorite programming language"
            placeholder="Select Location"
            onValueChange={itemValue => this.setState({location: itemValue})}
            _selectedItem={{
              bg: 'gray',
              // endIcon: nu,
            }}>
            {this.state.data.map(item => {
              return <Select.Item label={item.Loc_Name} value={item.Loc_ID} />;
            })}
          </Select>
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
            label="Upload Image"
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
            text="Add"
            onPress={() => this.AddProfile()}
            backgroundColor="#6633FF"
          />
        </View>
      </SafeAreaView>
    );
  }
}
