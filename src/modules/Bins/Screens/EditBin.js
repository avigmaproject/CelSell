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
  Alert,
} from 'react-native';
import {Select, Toast} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {FAB, Checkbox} from 'react-native-paper';
import HeaderwithDelete from '../../../components/HeaderwithDelete';
import InputText from '../../../components/InputText';
import Button from '../../../components/Button';
import {
  getlocation,
  updatebin,
  uploadimage,
  getbins,
} from '../../../services/api.function';

const options = [
  'Cancel',
  <View>
    <Text style={{color: 'black'}}>Gallery</Text>
  </View>,
  <Text style={{color: 'black'}}>Camera</Text>,
];

export default class EditBin extends Component {
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
      unit: null,
      shelf: null,
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.GetImage();
      this.GetLocation();
      this.getToken();
    });
  }

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

  GetBins = async token => {
    this.setState({loading: true});
    var data = JSON.stringify({
      Bin_PkeyID: this.props.route.params.item.Bin_PkeyID,
      Type: 2,
      Bin_PkeyID_Master: 1,
      Bin_PkeyID_Owner: 1,
    });
    try {
      const res = await getbins(data, token);
      console.log(res, 'redsssssssssss');
      this.setState({
        name: res[0][0].Bin_Name,
        imagepath: res[0][0].Bin_Image_Path,
        unit: res[0][0].Bin_Unit,
        shelf: res[0][0].Bin_Shelf,
        loading: false,
        location: res[0][0].Loc_Name,
      });
    } catch (error) {
      this.setState({loading: false});
      console.log('hihihihihihih', {e: error.response.data.error});
    }
  };

  UpdateBin = async () => {
    this.setState({loading: false});
    const Userid = Number(await AsyncStorage.getItem('ownerid'));
    let data = {
      Bin_PkeyID: this.props.route.params.item.Bin_PkeyID,
      Bin_Name: this.state.name,
      Bin_IsActive: 1,
      Bin_IsDelete: 0,
      Type: 2,
      Bin_PkeyID_Master: 1,
      Bin_PkeyID_Owner: Userid,
      Bin_Loc_ID: 1,
      Bin_Unit: this.state.unit,
      Bin_Shelf: this.state.shelf,
      Bin_Image_Path: this.state.imagepath,
      Loc_Name: this.state.location,
      Bin_QR_Path: this.props.route.params.item.Bin_QR_Path,
    };
    console.log(data, 'addbin');
    try {
      token = await AsyncStorage.getItem('token');
      const res = await updatebin(data, token);
      console.log('ressssss:', res);
      this.showMessage('Bin Updated');
      this.props.navigation.navigate('HomeScreen');
      this.setState({loading: false});
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
      console.log(data, 'dataaaaaa');
      console.log(res, 'resssss');
      this.setState({loading: false, imagepath: res[0].Image_Path});
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

  getToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('token');
      if (token) {
        this.GetBins(token);
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
        // backgroundColor: 'red.500',
      });
    }
  };

  deletebin = async () => {
    this.setState({loading: false});
    let data = {
      Bin_PkeyID: this.props.route.params.item.Bin_PkeyID,
      Bin_IsActive: false,
      Type: 4,
    };
    try {
      token = await AsyncStorage.getItem('token');
      const res = await updatebin(data, token);
      console.log('ressssss:', res);
      this.showMessage('Bin Deleted');
      this.props.navigation.navigate('HomeScreen');
      this.setState({loading: false});
    } catch (error) {
      this.showerrorMessage(error.response.data.error_description);
    }
  };

  Delete = () => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this bin?',
      [{text: 'DELETE', onPress: () => this.deletebin()}, {text: 'CANCEL'}],
      {cancelable: false},
    );
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <Spinner visible={this.state.loading} />
        <ScrollView keyboardShouldPersistTaps="handled">
          <HeaderwithDelete
            text="Edit Bin"
            onPress={() => this.props.navigation.goBack()}
            onDelete={() => this.Delete()}
          />
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
                  borderRadius: 1,
                  borderColor: '#BDBDBD',
                  borderWidth: 1,
                }}
                source={{
                  uri: this.state.imagepath
                    ? this.state.imagepath
                    : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg',
                }}
              />
            </View>
          </View>

          <View style={{marginTop: 100}}>
            <Button
              text="Save"
              backgroundColor="#6633FF"
              onPress={() => this.UpdateBin()}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
