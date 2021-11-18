import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {Select, Toast} from 'native-base';
import {FAB, Checkbox} from 'react-native-paper';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderwithDelete from '../../../../components/HeaderwithDelete';
import InputText from '../../../../components/InputText';
import Button from '../../../../components/Button';
import {verifyEmail} from '../../../Auth/miscellaneous/miscellaneous.configure';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {
  getprofiles,
  getlocation,
  updateprofile,
  activeprofile,
  deleteprofile,
  uploadimage,
} from '../../../../services/api.function';

const options = [
  'Cancel',
  <View>
    <Text style={{color: 'black'}}>Gallery</Text>
  </View>,
  <Text style={{color: 'black'}}>Camera</Text>,
];

export default class UpdateProfile extends Component {
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
      Id: null,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', async () => {
      this.GetImage();
      this.GetLocation();
      this.getToken();
    });
  }

  GetImage = async () => {
    this.setState({
      photo: await AsyncStorage.getItem('imagepath'),
    });
  };

  GetProfile = async token => {
    this.setState({
      loading: true,
    });
    var data = JSON.stringify({
      Type: 4,
      User_PkeyID: this.props.route.params.item.User_PkeyID,
    });
    try {
      const res = await getprofiles(data, token);
      this.setState({
        email: res[0][0].User_Email,
        name: res[0][0].User_Name,
        location: res[0][0].User_Address,
        imagepath: res[0][0].User_Image_Path,
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

  Validation = () => {
    let cancel = false;
    const {name, email} = this.state;
    if (name.length === 0) {
      cancel = true;
    }
    if (email.length === 0) {
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

  UpdateProfiles = async () => {
    if (this.Validation() && this.checkEmail(this.state.email)) {
      this.setState({loading: true});
      let data = {
        Type: 8,
        User_PkeyID: this.props.route.params.item.User_PkeyID,
        User_Email: this.state.email,
        User_Name: this.state.name,
        User_Address: this.state.location,
        User_Image_Path: this.state.imagepath,
        User_IsActive: true,
      };
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await updateprofile(data, token);
        console.log('ressssss:', res);
        this.showMessage('Profile Updated');
        this.props.navigation.navigate('Profiles');
        this.setState({loading: false});
      } catch (error) {
        showerrorMessage(error.response.data.error_description);
      }
    }
  };

  getToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('token');
      console.log(token, 'token');
      if (token) {
        this.GetProfile(token);
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
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

  GetLocation = async () => {
    this.setState({loading: true});
    var data = JSON.stringify({
      Type: 1,
    });
    try {
      const res = await getlocation(data);
      this.setState({data: res[0], loading: false});

      console.log(res, 'ressssssss');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      let message = '';
      if (error.response) {
        this.setState({loading: false});
      } else {
        message = '';
      }
      console.log({message});
    }
  };

  // const activateProfile = async () => {
  //   if (!checkboxState) {
  //     setLoading(true);
  //     let data = {
  //       Type: 9,
  //       User_PkeyID: route.params.item.User_PkeyID,
  //       User_IsActive_Prof: true,
  //     };
  //     console.log('route.params.item.User_PkeyID', data);
  //     setLoading(false);
  //     const token = await AsyncStorage.getItem('token');
  //     const res = await activeprofile(data, token);
  //     console.log(res, 'res');
  //     showMessage(route.params.item.User_Name + ' is active');
  //     // setProfileId();
  //   }
  // };

  deleteProfile = async () => {
    const id = route.params.item.User_PkeyID_Master;
    if (id !== 0) {
      this.setState({loading: true});
      let data = {
        Type: 8,
        User_PkeyID: route.params.item.User_PkeyID,
        User_Email: route.params.item.User_Email,
        User_Name: route.params.item.User_Name,
        User_IsActive: false,
      };
      this.setState({loading: false});
      const token = await AsyncStorage.getItem('token');
      const res = await deleteprofile(data, token);
      this.showMessage('Profile deleted!');
      this.props.navigation.navigate('Profiles');
    } else {
      warningMessage("main profile can't be deletable");
    }
  };

  Delete = () => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this profile?',
      [{text: 'DELETE', onPress: () => this.deleteProfile()}, {text: 'CANCEL'}],
      {cancelable: false},
    );
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
        <HeaderwithDelete
          text="Edit Profile"
          onPress={() => this.props.navigation.goBack()}
          onDelete={() => this.Delete()}
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
            style={{
              fontSize: 14,
              paddingLeft: 20,
              color: '#000',
              height: 55,
              backgroundColor: '#fff',
            }}
            selectedValue={this.state.location}
            width="90%"
            placeholder="Enter Location"
            onValueChange={itemValue => this.setState({location: itemValue})}
            _selectedItem={{
              bg: 'gray',
            }}>
            {this.state.data.map(item => {
              return <Select.Item label={item.Loc_Name} value={item.Loc_ID} />;
            })}
          </Select>
        </View>
        {/* 
      <View>
        <BouncyCheckbox
          size={35}
          fillColor="#00FF00"
          iconStyle={{color: '#000'}}
          onPress={(isChecked: boolean) => {
            activateProfile(), setCheckboxState(!checkboxState);
          }}
          style={{
            position: 'absolute',
            left: 25,
            justifyContent: 'center',
            top: 20,
          }}
        />
        <View style={{position: 'absolute', left: 80, top: 30}}>
          <Text style={{fontSize: 16, fontWeight: '600'}}>
            Activate Profile
          </Text>
        </View>
      </View> */}
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
            text="Save Profile"
            backgroundColor="#6633FF"
            onPress={() => this.UpdateProfiles()}
          />
        </View>
      </SafeAreaView>
    );
  }
}
