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
  Keyboard,
} from 'react-native';
import {Select, Toast} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Carousel from 'react-native-snap-carousel';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import Header from '../Components/Header';
import Paragraph from '../Components/Paragraph';
import IncreDecre from '../Components/IncreDecre';
import Feather from 'react-native-vector-icons/Feather';
import InputText from '../../../components/InputText';
import Button from '../../../components/Button';
import {
  uploadimage,
  addupdateproducts,
  getcategorymaster,
  getsubcategorymaster,
  getvendormaster,
  getcolor,
} from '../../../services/api.function';

const options = [
  'Cancel',
  <View>
    <Text style={{color: 'black'}}>Gallery</Text>
  </View>,
  <Text style={{color: 'black'}}>Camera</Text>,
];

export default class CreateItem extends Component {
  constructor() {
    super();
    this.state = {
      binid: null,
      title: '',
      brand: '',
      gender: null,
      color: null,
      size: '',
      vendor: null,
      condition: null,
      celebrity: null,
      newused: null,
      clicks: 0,
      show: false,
      imagepath: [],
      description: '',
      price: '',
      associated: '',
      category: [],
      categoryid: '',
      subcategory: [],
      subcategoryid: '',
      checkboxpull: false,
      checkboxsold: false,
      checkboxshot: false,
      open: false,
      value: null,
      vendorList: [],
      addvendor: '',
      colordata: [],
      autogeneratetitle: '',
      notes: '',
      location: null,
      measurements: '',
      shot: '',
    };
    this.setValue = this.setValue.bind(this);
  }

  setValue(callback) {
    this.setState(state => ({
      value: callback(state.value),
    }));
    console.log(this.state.value, 'this.state.value');
  }

  setItems(callback) {
    this.setState(state => ({
      vendorList: callback(state.vendorList),
    }));
    console.log(this.state.vendorList, 'this.state.vendorList');
  }

  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.setState({
        binid: this.props.route.params.id,
      });
      this.getcategory();
      this.getvendor();
      this.getcolordata();
    });
  }

  componentWillUnmount() {
    this._unsubscribe;
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

  onOpenImage = () => this.ActionSheet.show();

  ImageGallery = async () => {
    setTimeout(() => {
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
                Platform.OS === 'ios' ? image.filename : 'image' + new Date(),
              // imagepath: image.path,
            },
            () => {
              this.uploadImage();
            },
          );
        }
      });
    }, 700);
  };

  ImageCamera = async () => {
    setTimeout(() => {
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
                Platform.OS === 'ios' ? image.filename : 'image' + new Date(),
              // imagepath: image.path,
            },
            () => {
              this.uploadImage();
            },
          );
        }
      });
    }, 700);
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
      // console.log(res, 'resssss');
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

  getcategory = async () => {
    let data = {
      Type: 3,
    };
    try {
      let token = await AsyncStorage.getItem('token');
      const res = await getcategorymaster(data, token);
      this.setState({
        category: res[0],
      });
      console.log(res, 'getcategory');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
    }
  };

  getsubcategory = async () => {
    let data = {
      Type: 3,
      SubCat_Cat_Pkey: this.state.categoryid,
    };
    console.log(data, 'subcategory');
    try {
      let token = await AsyncStorage.getItem('token');
      const res = await getsubcategorymaster(data, token);
      console.log(res, 'getsubcategory');
      if (res[0] != undefined) {
        this.setState({
          subcategory: res[0],
        });
      } else {
        this.setState({
          subcategory: [],
        });
      }
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
    }
  };

  setOpen() {
    this.setState({
      open: !this.state.open,
    });
  }

  getvendor = async () => {
    this.setState({loading: true});
    let data = {
      Type: 3,
    };
    try {
      let token = await AsyncStorage.getItem('token');
      const res = await getvendormaster(data, token);

      const itemlist = res[0].map(item => ({
        label: item.Ven_Name,
        value: item.Ven_PkeyID,
      }));
      console.log(itemlist, 'itemlist');
      this.setState({
        vendorList: itemlist,
        loading: false,
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({loading: false});
    }
  };

  getcolordata = async () => {
    this.setState({loading: true});
    let data = {
      Type: 3,
    };
    try {
      let token = await AsyncStorage.getItem('token');
      const res = await getcolor(data, token);
      console.log(res, 'coloerr');
      this.setState({
        colordata: res[0],
        loading: false,
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({loading: false});
    }
  };
  Validation = () => {
    let cancel = false;
    if (this.state.brand.length === 0) {
      cancel = true;
    }
    if (this.state.color === null) {
      cancel = true;
    }
    if (this.state.size.length === 0) {
      cancel = true;
    }
    if (this.state.gender === null) {
      cancel = true;
    }
    if (this.state.newused === null) {
      cancel = true;
    }
    if (this.state.subcategoryid === null) {
      cancel = true;
    }
    if (cancel) {
      this.showerrorMessage('Fields can not be empty');
      return false;
    } else {
      return true;
    }
  };

  validateNewused = value => {
    var lvalue = 0;
    switch (value) {
      case 1: {
        lvalue = 'New';
        break;
      }
      case 2: {
        lvalue = 'Used';
        break;
      }
    }
    return lvalue;
  };

  validateGender = value => {
    var lvalue = 0;
    switch (value) {
      case 2: {
        lvalue = "Men's";
        break;
      }
      case 1: {
        lvalue = "Women's";
        break;
      }
    }
    return lvalue;
  };

  validateSubcategory = value => {
    const {subcategory} = this.state;
    for (var i = 0; i < subcategory.length; i++) {
      if (value === subcategory[i].SubCat_Pkey) {
        return subcategory[i]['SubCat_Name'];
      }
    }
  };

  validateColor = value => {
    const {colordata} = this.state;
    for (var i = 0; i < colordata.length; i++) {
      if (value === colordata[i].Col_PkeyID) {
        return colordata[i].Col_Name;
      }
    }
  };

  autogeneratedTitle = value => {
    const {title, brand, gender, color, subcategoryid, newused, size} =
      this.state;
    let autogenerate = '';
    if (value === '' || value === null) {
      autogenerate =
        brand +
        ' ' +
        this.validateGender(gender) +
        ' ' +
        this.validateColor(color) +
        ' ' +
        this.validateSubcategory(subcategoryid) +
        ' ' +
        '-' +
        ' ' +
        this.validateNewused(newused) +
        ' ' +
        '-' +
        ' ' +
        'Size' +
        ' ' +
        size;

      // console.log(autogenerate, 'autogenerate');
      // this.setState({autogeneratetitle: autogenerate});
    }
    return autogenerate;
  };

  createProduct = async () => {
    Keyboard.dismiss();
    if (this.Validation()) {
      this.setState({loading: true});
      let data = {
        Pro_Bin_PkeyID: this.props.route.params.id,
        Pro_PkeyID: 0,
        Pro_Name:
          this.state.title != ''
            ? this.state.title
            : this.autogeneratedTitle(this.state.title),
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
        Type: 1,
        Pro_new_Used: this.state.newused,
        Pro_Celeb_Ent: this.state.celebrity,
        // Pro_Vendor_Name: this.state.vendor,
        Pro_Qty: this.state.clicks,
        Pro_Desc: this.state.description,
        Pro_Images: JSON.stringify(this.state.imagepath),
        // ProImage_ImagePath: 'abc',
        product_Image_DTOs: null,
        Pro_Price: this.state.price,
        Pro_Pull: this.state.checkboxpull,
        Pro_Sold: this.state.checkboxsold,
        Pro_Vendor_Name: this.state.addvendor,
        Pro_Vendor: this.state.vendor,
        Pro_Associated_Cost: this.state.associated,
        Pro_Notes: this.state.notes,
        Pro_Location: this.state.location,
        Pro_Measurements: this.state.measurements,
        Pro_Shot: this.state.checkboxshot,
      };
      console.log(data, 'datssssssss');
      try {
        this.setState({loading: false});
        const token = await AsyncStorage.getItem('token');
        const res = await addupdateproducts(data, token);
        console.log('resssss', res);
        this.showMessage('Item Added');
        this.props.navigation.navigate('ShowBinData');
      } catch (error) {
        this.setState({loading: false});
        this.showerrorMessage(error.response.data.error_description);
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

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <Spinner visible={this.state.loading} />
        <Header
          header="Add Item"
          onPressCancel={() => this.props.navigation.goBack()}
          // onPressSave={() => this.createProduct()}
        />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
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
              {/* <Select.Item label="Other" value={3} /> */}
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
              selectedValue={this.state.color}
              width="90%"
              placeholder="Choose Color"
              onValueChange={itemValue => this.setState({color: itemValue})}
              _selectedItem={{
                bg: 'gray',
              }}>
              {this.state.colordata.map(item => {
                return (
                  <Select.Item label={item.Col_Name} value={item.Col_PkeyID} />
                );
              })}
            </Select>
          </View>
          <View style={{marginTop: 20}}>
            <Paragraph
              label="Description"
              onChangeText={description =>
                this.setState({description: description})
              }
              value={this.state.description}
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
                    value={item.SubCat_Pkey}
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
              <Select.Item label="New" value={1} />
              <Select.Item label="Used" value={2} />
            </Select>
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Measurements"
              onChangeText={measurements =>
                this.setState({measurements: measurements})
              }
              value={this.state.measurements}
              placeholder="Enter Measurements"
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
              selectedValue={this.state.condition}
              width="90%"
              placeholder="Condition"
              onValueChange={itemValue => this.setState({condition: itemValue})}
              _selectedItem={{
                bg: 'gray',
              }}>
              <Select.Item label="Excellent" value={1} />
              <Select.Item label="Good" value={2} />
              <Select.Item label="Fair" value={3} />
              <Select.Item label="New" value={4} />
            </Select>
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Size"
              onChangeText={size => this.setState({size: size})}
              value={this.state.size}
              placeholder="Enter Size"
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
              selectedValue={this.state.celebrity}
              width="90%"
              placeholder="Celebrity/Entourage"
              onValueChange={itemValue => this.setState({celebrity: itemValue})}
              _selectedItem={{
                bg: 'gray',
              }}>
              <Select.Item label="Celebrity" value={1} />
              <Select.Item label="Entourage" value={2} />
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
          <View style={{marginTop: 20, alignItems: 'center'}}>
            <DropDownPicker
              open={this.state.open}
              value={this.state.value}
              items={this.state.vendorList}
              setOpen={() => this.setOpen()}
              setValue={this.setValue}
              setItems={this.setItems}
              searchable={true}
              listMode={'MODAL'}
              placeholder="Vendor Name"
              onChangeValue={value => {
                this.setState({vendor: value});
              }}
              style={{
                borderRadius: 0,
                borderBottomWidth: 2,
                borderColor: '#ffffff',
                paddingHorizontal: 0,
                backgroundColor: '#ffffff',
                height: 60,
                width: '90%',
                paddingLeft: 20,
              }}
              containerStyle={{
                backgroundColor: '#ffffff',
                width: '90%',
                borderRadius: 0,
              }}
              placeholderStyle={{color: 'gray'}}
              searchPlaceholder="Search..."
              searchTextInputStyle={{
                borderRadius: 0,
                height: 40,
              }}
            />
          </View>

          {this.state.vendor === -90 ? (
            <View style={{marginTop: 20}}>
              <InputText
                label="Add Vendor"
                onChangeText={addvendor =>
                  this.setState({addvendor: addvendor})
                }
                value={this.state.addvendor}
                placeholder="Enter new vendor name"
              />
            </View>
          ) : null}

          <View style={{marginTop: 20}}>
            <InputText
              label="Associated Costs"
              onChangeText={associated =>
                this.setState({associated: associated})
              }
              value={this.state.associated}
              placeholder="Enter Associated Costs"
            />
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Notes"
              onChangeText={notes => this.setState({notes: notes})}
              value={this.state.notes}
              placeholder="Enter Notes"
            />
          </View>
          <View style={{marginTop: 20}}>
            <InputText
              label="Location"
              onChangeText={location => this.setState({location: location})}
              value={this.state.location}
              placeholder="Enter Location"
            />
          </View>
          {/* <View style={{marginTop: 20}}>
            <InputText
              label="Shot"
              onChangeText={brand => this.setState({shot: shot})}
              value={this.state.shot}
              placeholder="Enter Shot"
            />
          </View> */}
          <IncreDecre
            onPressIncre={() => this.IncrementItem()}
            onPressDecre={() => this.DecreaseItem()}
            value={this.state.clicks}
          />
          <View
            style={{
              marginTop: 30,
              paddingRight: 35,
              flexDirection: 'row',
              justifyContent: 'space-around',
              // paddingVertical: 20,
              marginBottom: 30,
            }}>
            <BouncyCheckbox
              size={30}
              fillColor="#6633FF"
              iconStyle={{color: '#000'}}
              text="Pull"
              isChecked={this.state.checkboxpull}
              disableBuiltInState
              onPress={(isChecked: boolean) => {
                this.setState({checkboxpull: !this.state.checkboxpull});
              }}
              textStyle={{fontSize: 18, color: '#000', fontWeight: 'bold'}}
            />
            <BouncyCheckbox
              size={30}
              fillColor="#6633FF"
              iconStyle={{color: '#000'}}
              text="Sold"
              isChecked={this.state.checkboxsold}
              disableBuiltInState
              onPress={(isChecked: boolean) => {
                this.setState({checkboxsold: !this.state.checkboxsold});
              }}
              textStyle={{fontSize: 18, color: '#000', fontWeight: 'bold'}}
            />
            <BouncyCheckbox
              size={30}
              fillColor="#6633FF"
              iconStyle={{color: '#000'}}
              text="Shot"
              isChecked={this.state.checkboxshot}
              disableBuiltInState
              onPress={(isChecked: boolean) => {
                this.setState({checkboxshot: !this.state.checkboxshot});
              }}
              textStyle={{fontSize: 18, color: '#000', fontWeight: 'bold'}}
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
          <View
            style={{
              marginTop: 20,
              paddingLeft: 25,
              flexDirection: 'row',
            }}>
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
                {this.state.imagepath.map(image => {
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
                })}
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
          <View style={{marginTop: 50, marginBottom: 25}}>
            <Button
              text="Save"
              backgroundColor="#6633FF"
              onPress={() => {
                this.createProduct();
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}
