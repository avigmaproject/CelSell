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
  Button,
} from 'react-native';
import {Select, Toast} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import Carousel from 'react-native-snap-carousel';
import Header from '../Components/Header';
import Paragraph from '../Components/Paragraph';
import IncreDecre from '../Components/IncreDecre';
import Feather from 'react-native-vector-icons/Feather';
import InputText from '../../../components/InputText';
import {
  uploadimage,
  addupdateproducts,
  getproducts,
  getcategorymaster,
  getsubcategorymaster,
} from '../../../services/api.function';

const options = [
  'Cancel',
  <View>
    <Text style={{color: 'black'}}>Gallery</Text>
  </View>,
  <Text style={{color: 'black'}}>Camera</Text>,
];

export default class EditItem extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      brand: '',
      gender: null,
      color: '',
      size: '',
      vendor: '',
      condition: '',
      celebrity: '',
      newused: null,
      clicks: 0,
      show: false,
      getimagepath: '',
      imagepath: [],
      description: '',
      binid: '',
      price: null,
      category: [],
      categoryid: '',
      subcategory: [],
      subcategoryid: '',
      imageflag: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.getToken();
      this.getcategory();
    });
  }

  IncrementItem = () => {
    this.setState({clicks: this.state.clicks + 1});
  };
  DecreaseItem = () => {
    if (this.state.clicks <= 0) {
      this.setState({
        clicks: 0,
      });
    } else {
      this.setState({clicks: this.state.clicks - 1});
    }
  };

  GetProducts = async token => {
    this.setState({
      loading: true,
    });
    var data = JSON.stringify({
      Pro_PkeyID: this.props.route.params.item.Pro_PkeyID,
      Bin_PkeyID: 1,
      User_PkeyID: 1,
      Type: 2,
    });
    try {
      const res = await getproducts(data, token);
      console.log(res, 'redsssssssssss');
      // console.log('res[0][0].Pro_Price', res[0][0].Pro_Price);
      this.setState({
        description: res[0][0].Pro_Desc,
        title: res[0][0].Pro_Name,
        getimagepath: res[0][0].ProImage_ImagePath,
        brand: res[0][0].Pro_BrandName,
        gender: res[0][0].Pro_Gender,
        color: res[0][0].Pro_Color,
        size: res[0][0].Pro_Size,
        vendor: res[0][0].Pro_Vendor_Name,
        condition: res[0][0].Pro_Condition,
        celebrity: res[0][0].Pro_Celeb_Name,
        newused: res[0][0].Pro_new_Used,
        price: res[0][0].Pro_Price,
        categoryid: res[0][0].Pro_Category,
        subcategoryid: res[0][0].Pro_SubCategory,
        binid: res[0][0].Pro_Bin_PkeyID,
        loading: false,
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({loading: false});
    }
  };

  getToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('token');
      if (token) {
        this.GetProducts(token);
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
    }
  };

  getcategory = async () => {
    let data = {
      Type: 1,
    };
    try {
      let token = await AsyncStorage.getItem('token');
      const res = await getcategorymaster(data, token);
      this.setState({
        category: res[0],
      });
      console.log(res, 'ressss');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
    }
  };

  getsubcategory = async () => {
    let data = {
      Type: 3,
      SubCat_Cat_Pkey: this.state.categoryid,
    };
    try {
      let token = await AsyncStorage.getItem('token');
      const res = await getsubcategorymaster(data, token);
      this.setState({
        subcategory: res[0],
      });
      console.log(res, 'ressss');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
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
            imageflag: true,
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
            imageflag: true,
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
      console.log(res, 'resssss');
      const ProImage_ImagePath = '';
      const ProImage_IsFirst = false;
      const ProImage_Number = 0;

      if (this.state.imagepath.length === 0) {
        var imagedata = {
          ProImage_ImagePath: res[0].Image_Path,
          ProImage_IsFirst: true,
          ProImage_Number: 1,
          Type: 1,
        };
      } else {
        var imagedata = {
          ProImage_ImagePath: res[0].Image_Path,
          ProImage_IsFirst: false,
          ProImage_Number: this.state.imagepath.length + 1,
          Type: 1,
        };
      }
      const joined = this.state.imagepath.concat(imagedata);
      this.setState({imagepath: joined, loading: false});
      console.log(this.state.imagepath, 'imagepathimagepath');
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

  Validation = () => {
    let cancel = false;
    if (this.state.title.length === 0) {
      cancel = true;
    }
    if (this.state.brand.length === 0) {
      cancel = true;
    }
    if (this.state.color.length === 0) {
      cancel = true;
    }
    if (this.state.size.length === 0) {
      cancel = true;
    }
    if (this.state.vendor.length === 0) {
      cancel = true;
    }
    if (this.state.condition.length === 0) {
      cancel = true;
    }
    if (this.state.celebrity.length === 0) {
      cancel = true;
    }
    if (this.state.description.length === 0) {
      cancel = true;
    }
    if (this.state.imagepath.length === 0) {
      cancel = true;
    }
    if (cancel) {
      this.showerrorMessage('Fields can not be empty');
      return false;
    } else {
      return true;
    }
  };

  editProduct = async () => {
    this.setState({loading: true});
    let data = {
      Pro_PkeyID: this.props.route.params.item.Pro_PkeyID,
      Pro_Name: this.state.title,
      Pro_BrandName: this.state.brand,
      Pro_Gender: this.state.gender,
      Pro_Color: this.state.color,
      // Pro_Detail: 'samsung galaxy',
      Pro_Category: this.state.categoryid,
      Pro_SubCategory: this.state.subcategoryid,
      Pro_Condition: this.state.condition,
      Pro_Size: this.state.size,
      Pro_IsActive: 1,
      Pro_IsDelete: 0,
      Type: 2,
      Pro_new_Used: this.state.newused,
      Pro_Celeb_Name: this.state.celebrity,
      Pro_Vendor_Name: this.state.vendor,
      Pro_Qty: this.state.clicks,
      Pro_Desc: this.state.description,
      Pro_Images: JSON.stringify(this.state.imagepath),
      // ProImage_ImagePath: 'abc',
      product_Image_DTOs: null,
      Pro_Bin_PkeyID: this.state.binid,
      Pro_Price: this.state.price,
    };
    console.log(data, 'datssssssss');
    try {
      this.setState({loading: false});
      token = await AsyncStorage.getItem('token');
      const res = await addupdateproducts(data, token);
      console.log('resssss', res);
      this.showMessage('Item Updated');
      this.props.navigation.navigate('ItemList');
    } catch (error) {
      this.setState({loading: false});
      this.showerrorMessage(error.response.data.error_description);
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

  render() {
    console.log(this.state.price, 'Pro_SubCategory');
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <Spinner visible={this.state.loading} />
        <Header
          header="Edit Item"
          onPressCancel={() => this.props.navigation.goBack()}
          onPressSave={() => this.editProduct()}
        />
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{marginTop: 20}}>
            <InputText
              label="Title of Item"
              onChangeText={title => this.setState({title: title})}
              value={this.state.title}
              placeholder="Enter Title Name"
            />
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Brand name"
              onChangeText={brand => this.setState({brand: brand})}
              value={this.state.brand}
              placeholder="Enter Brand Name"
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
              selectedValue={this.state.gender}
              width="90%"
              placeholder="Gender"
              onValueChange={itemValue => this.setState({gender: itemValue})}
              _selectedItem={{
                bg: 'gray',
              }}>
              <Select.Item label="Female" value={1} />
              <Select.Item label="Male" value={2} />
              <Select.Item label="Other" value={3} />
            </Select>
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Color"
              onChangeText={color => this.setState({color: color})}
              value={this.state.color}
              placeholder="Enter Color"
            />
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Size"
              onChangeText={size => this.setState({size: size})}
              value={this.state.size}
              placeholder="Enter Size"
            />
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Vendor name"
              onChangeText={vendor => this.setState({vendor: vendor})}
              value={this.state.vendor}
              placeholder="Enter Vendor name"
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
              selectedValue={this.state.categoryid}
              width="90%"
              placeholder="Product Category"
              onValueChange={itemValue =>
                this.setState({categoryid: itemValue}, () =>
                  this.getsubcategory(),
                )
              }
              _selectedItem={{
                bg: 'gray',
              }}>
              {this.state.category.map(item => {
                return (
                  <Select.Item label={item.Cat_Name} value={item.Cat_Pkey} />
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
                height: 55,
                backgroundColor: '#fff',
              }}
              selectedValue={this.state.subcategoryid}
              width="90%"
              placeholder="Sub Category"
              onValueChange={itemValue =>
                this.setState({subcategoryid: itemValue})
              }
              _selectedItem={{
                bg: 'gray',
              }}>
              {this.state.subcategory.map(item => {
                return (
                  <Select.Item
                    label={item.SubCat_Name}
                    value={item.SubCat_Cat_Pkey}
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
                height: 55,
                backgroundColor: '#fff',
              }}
              selectedValue={this.state.newused}
              width="90%"
              placeholder="New/Used"
              onValueChange={itemValue => this.setState({newused: itemValue})}
              _selectedItem={{
                bg: 'gray',
              }}>
              <Select.Item label="New" value={0} />
              <Select.Item label="Used" value={1} />
            </Select>
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Price"
              onChangeText={price => this.setState({price: price})}
              value={this.state.price}
              placeholder="Enter Price of Item"
              keyboardType="numeric"
            />
            <Feather
              name="dollar-sign"
              size={25}
              color="gray"
              style={{position: 'absolute', right: 30, bottom: 15}}
            />
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Condition"
              onChangeText={condition => this.setState({condition: condition})}
              value={this.state.condition}
              placeholder="Enter Condition"
            />
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Celebrity/Entourage"
              onChangeText={celebrity => this.setState({celebrity: celebrity})}
              value={this.state.celebrity}
              placeholder="Enter Celebrity/Entourage"
            />
          </View>
          <View style={{marginTop: 20, paddingLeft: 25}}>
            <Text
              style={{
                color: '#555555',
                fontSize: 18,
                fontWeight: '500',
                lineHeight: 27,
              }}>
              Add images
            </Text>
          </View>
          <View style={{marginTop: 20, paddingLeft: 25, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => this.onOpenImage()}
              style={{
                backgroundColor: '#E5DFF5',
                height: 100,
                width: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Feather name="plus" size={30} color="#6633FF" />
            </TouchableOpacity>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{
                marginHorizontal: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                {this.state.imageflag === true ? (
                  this.state.imagepath.map(image => {
                    console.log('********', image);
                    return (
                      <View>
                        <Image
                          source={{
                            uri: image.ProImage_ImagePath,
                          }}
                          // resizeMode="contain"
                          style={{
                            height: 100,
                            width: 100,
                            paddingLeft: 20,
                          }}
                        />
                      </View>
                    );
                  })
                ) : (
                  <View>
                    <Image
                      source={{
                        uri: this.state.getimagepath,
                      }}
                      // resizeMode="contain"
                      style={{
                        height: 100,
                        width: 100,
                        paddingLeft: 20,
                      }}
                    />
                  </View>
                )}
              </View>
            </ScrollView>
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
          <IncreDecre
            onPressIncre={() => this.IncrementItem()}
            onPressDecre={() => this.DecreaseItem()}
            value={this.state.clicks}
          />
          <View style={{marginTop: 30, marginBottom: 30}}>
            <Paragraph
              label="Description"
              onChangeText={description =>
                this.setState({description: description})
              }
              text={this.state.description}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
