import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Spinner from 'react-native-loading-spinner-overlay';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {DrawerActions} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FAB} from 'react-native-paper';
import InputView from '../../../../components/InputView';
import Button from '../../../../components/Button';
import BackButton from '../../../../components/BackButton';
import {
  userprofile,
  registerStoreImage,
} from '../../../../services/api.function';

const options = [
  'Cancel',
  <View>
    <Text style={{color: 'black'}}>Gallery</Text>
  </View>,
  <Text style={{color: 'black'}}>Camera</Text>,
];

export default class MyProfile extends Component {
  constructor() {
    super();
    this.state = {
      base64: '',
      filename: 'image',
      imagepath: '',
      loading: false,
      name: '',
      email: '',
      phone: null,
      gender: null,
      userid: null,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.getToken();
    });
  }

  componentWillUnmount() {
    this._unsubscribe;
  }

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
              Platform.OS === 'ios' ? image.filename : 'images' + new Date(),
            imagepath: image.path,
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
              Platform.OS === 'ios' ? image.filename : 'images' + new Date(),
            imagepath: image.path,
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
      Type: 6,
      User_Image_Base: 'data:image/png;base64, ' + base64,
    });
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await registerStoreImage(data, token);
      console.log(data, 'dataaaaaa');
      console.log(res, 'resssss');
      AsyncStorage.setItem('imagepath', res[1]);
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

  getUserData = async token => {
    this.setState({loading: true});
    var data = JSON.stringify({
      User_PkeyId: 1,
      User_PkeyID_Master: 1,
      Type: 2,
    });
    try {
      const res = await userprofile(data, token);
      console.log(res, 'ressssssss');
      console.log(res[0][0].User_Email, ' res[0][0].User_Email');
      this.setState({
        name: res[0][0].User_Name,
        email: res[0][0].User_Email,
        phone: res[0][0].User_Phone,
        userid: res[0][0].User_PkeyID,
        gender: res[0][0].User_Gender,
        imagepath: res[0][0].User_Image_Path,
        loading: false,
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      let message = '';
      if (error.response) {
        this.setState({isLoading: false});
      } else {
        message = '';
      }
      console.log({message});
    }
  };

  getToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('token');
      if (token) {
        this.getUserData(token);
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
    }
  };

  validateGender = value => {
    var lvalue = 0;
    switch (value) {
      case null: {
        lvalue = 'NA';
        break;
      }
      case 2: {
        lvalue = 'Other';
        break;
      }
      case 1: {
        lvalue = 'Male';
        break;
      }
      case 0: {
        lvalue = 'Female';
        break;
      }
    }
    return lvalue;
  };

  render() {
    const {name, email, phone, userid, gender, imagepath, loading} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <Spinner visible={loading} />
        <View
          style={{
            backgroundColor: '#fff',
            height: 200,
            justifyContent: 'center',
            //   alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{position: 'absolute', left: 20, top: 20}}>
            <AntDesign name="arrowleft" size={30} color="#0F0B56" />
          </TouchableOpacity>
          <Text
            style={{
              color: '#0F0B56',
              fontSize: 24,
              lineHeight: 36,
              fontWeight: '700',
              top: 20,
            }}>
            Main Profile
          </Text>
          <TouchableOpacity
            style={{
              position: 'absolute',
              zIndex: 100,
              top: 80,
            }}
            onPress={() => this.onOpenImage()}>
            <Image
              style={{
                height: 200,
                width: 200,
                borderRadius: 150,
                borderColor: '#BDBDBD',
                borderWidth: 1,
                top: 10,
              }}
              source={{
                uri: imagepath
                  ? imagepath
                  : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg',
              }}
            />
            <FAB
              small
              icon="camera"
              style={{
                position: 'absolute',
                right: 0,
                bottom: 10,
                backgroundColor: '#ACACAC',
              }}
            />
          </TouchableOpacity>
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
        <ScrollView>
          <View
            style={{
              marginTop: 120,
            }}>
            <InputView text="Full Name" value={name} />
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            <InputView text="Phone no." value={phone != null ? phone : 'NA'} />
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            <InputView text="Email Address" value={email} />
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            <InputView
              text="Gender"
              value={
                this.validateGender(gender) != null
                  ? this.validateGender(gender)
                  : 'NA'
              }
            />
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            <InputView text="Password" value="********" />
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            <Button
              text="Edit Profile"
              onPress={() => this.props.navigation.navigate('EditProfile')}
              backgroundColor="#6633FF"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
