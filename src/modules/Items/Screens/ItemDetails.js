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
  Alert,
  Dimensions,
} from 'react-native';
import {Select, Toast} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FAB} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SliderBox} from 'react-native-image-slider-box';

import HeaderBack from '../../../components/HeaderBack';
import {
  getproducts,
  addupdateproducts,
  getcategorymaster,
  getsubcategorymaster,
  getvendormaster,
  getcolor,
} from '../../../services/api.function';
const windowWidth = Dimensions.get('window').width;

export default class ItemDetails extends Component {
  constructor() {
    super();
    this.state = {
      photo: '',
      loading: false,
      title: '',
      brand: '',
      gender: null,
      color: '',
      size: '',
      vendor: null,
      condition: '',
      celebrity: '',
      newused: null,
      clicks: 0,
      show: false,
      image_path: [],
      description: '',
      price: '',
      category: '',
      subcategory: '',
      barcodeimage: '',
      pull: false,
      sold: false,
      getcategory: [],
      getsubcategory: [],
      colordata: [],
      vendorList: [],
      associated: '',
      notes: '',
      location: null,
      shot: '',
      prodId: null,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.GetImage();
      if (this.props.route.params.check === undefined) {
        this.getToken();
      } else {
        this.GetProductsWithQr();
      }
      this.getcategory();
      this.getcolordata();
      this.getvendor();
    });
  }

  componentWillUnmount() {
    this._unsubscribe;
  }

  GetImage = async () => {
    const image = await AsyncStorage.getItem('imagepath');
    this.setState({photo: image});
  };

  getcategory = async () => {
    let data = {
      Type: 3,
    };
    try {
      let token = await AsyncStorage.getItem('token');
      const res = await getcategorymaster(data, token);
      this.setState({
        getcategory: res[0],
      });
      // console.log(res, 'getcategory');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
    }
  };

  validateCategory = value => {
    const {getcategory} = this.state;
    for (var i = 0; i < getcategory.length; i++) {
      if (value === getcategory[i].Cat_Pkey) {
        return getcategory[i]['Cat_Name'];
      }
    }
  };

  getsubcategory = async () => {
    let data = {
      Type: 3,
      SubCat_Cat_Pkey: this.state.category,
    };
    // console.log(data, 'subcategory');
    try {
      let token = await AsyncStorage.getItem('token');
      const res = await getsubcategorymaster(data, token);
      // console.log(res, 'getsubcategory');

      this.setState({
        getsubcategory: res[0],
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
    }
  };

  validateSubcategory = value => {
    const {getsubcategory} = this.state;
    for (var i = 0; i < getsubcategory.length; i++) {
      if (value === getsubcategory[i].SubCat_Pkey) {
        return getsubcategory[i]['SubCat_Name'];
      }
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
      // console.log(res, 'coloerr');
      this.setState({
        colordata: res[0],
        loading: false,
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({loading: false});
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

  validateCondition = value => {
    var lvalue = 0;
    switch (value) {
      case 4: {
        lvalue = 'New';
        break;
      }
      case 3: {
        lvalue = 'Fair';
        break;
      }
      case 2: {
        lvalue = 'Good';
        break;
      }
      case 1: {
        lvalue = 'Excellent';
        break;
      }
    }
    return lvalue;
  };

  getvendor = async () => {
    this.setState({loading: true});
    let data = {
      Type: 3,
    };
    try {
      let token = await AsyncStorage.getItem('token');
      const res = await getvendormaster(data, token);
      // console.log(res, 'vendorliost');
      this.setState({
        vendorList: res[0],
        loading: false,
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({loading: false});
    }
  };

  validateVendor = value => {
    const {vendorList} = this.state;
    for (var i = 0; i < vendorList.length; i++) {
      if (value === vendorList[i].Ven_PkeyID) {
        return vendorList[i]['Ven_Name'];
      }
    }
  };

  GetProducts = async token => {
    this.setState({
      loading: true,
    });
    var data = JSON.stringify({
      Pro_PkeyID: this.props.route.params.item.Pro_PkeyID
        ? this.props.route.params.item.Pro_PkeyID
        : this.props.route.params.item.PkeyID,
      Bin_PkeyID: 1,
      User_PkeyID: 1,
      Type: 2,
    });
    try {
      const res = await getproducts(data, token);
      console.log(res, 'resseses');
      const image = res[0][0]['product_Image_DTOs'];
      const Image_Path = [];
      for (var i = 0; i < image.length; i++) {
        Image_Path.push(image[i]['ProImage_ImagePath']);
        console.log(Image_Path, 'Image_Path');
      }

      this.setState(
        {
          description: res[0][0].Pro_Desc,
          title: res[0][0].Pro_Name,
          image_path: Image_Path,
          brand: res[0][0].Pro_BrandName,
          gender: res[0][0].Pro_Gender,
          color: res[0][0].Pro_Color,
          size: res[0][0].Pro_Size,
          vendor: res[0][0].Pro_Vendor,
          condition: res[0][0].Pro_Condition,
          celebrity: res[0][0].Pro_Celeb_Ent,
          newused: res[0][0].Pro_new_Used,
          price: res[0][0].Pro_Price,
          category: res[0][0].Pro_Category,
          subcategory: res[0][0].Pro_SubCategory,
          barcodeimage: res[0][0].Pro_BarCode_ImagePath,
          sold: res[0][0].Pro_Sold,
          pull: res[0][0].Pro_Pull,
          associated: res[0][0].Pro_Associated_Cost,
          notes: res[0][0].Pro_Notes,
          location: res[0][0].Pro_Location,
          shot: res[0][0].Pro_Shot,
          prodId: res[0][0].Pro_PkeyID,
          loading: false,
        },
        () => this.getsubcategory(),
      );
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({loading: false});
    }
  };

  GetProductsWithQr = async () => {
    this.setState({
      loading: true,
    });
    var data = JSON.stringify({
      Str_Pro_PkeyID: this.props.route.params.check,
      Type: 99,
    });
    try {
      console.log(data, 'data');
      const token = await AsyncStorage.getItem('token');
      const res = await getproducts(data, token);
      // console.log(res, 'redsssssssssss');
      const image = res[0][0]['product_Image_DTOs'];
      const Image_Path = [];
      for (var i = 0; i < image.length; i++) {
        Image_Path.push(image[i]['ProImage_ImagePath']);
        console.log(Image_Path, 'Image_Path');
      }

      this.setState({
        description: res[0][0].Pro_Desc,
        title: res[0][0].Pro_Name,
        image_path: Image_Path,
        brand: res[0][0].Pro_BrandName,
        gender: res[0][0].Pro_Gender,
        color: res[0][0].Pro_Color,
        size: res[0][0].Pro_Size,
        vendor: res[0][0].Pro_Vendor,
        condition: res[0][0].Pro_Condition,
        celebrity: res[0][0].Pro_Celeb_Ent,
        newused: res[0][0].Pro_new_Used,
        price: res[0][0].Pro_Price,
        category: res[0][0].Pro_Category,
        subcategory: res[0][0].Pro_SubCategory,
        barcodeimage: res[0][0].Pro_BarCode_ImagePath,
        shot: res[0][0].Pro_Shot,
        prodId: res[0][0].Pro_PkeyID,
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

  deleteItem = async () => {
    this.setState({loading: false});
    let data = {
      Pro_PkeyID: this.props.route.params.item.Pro_PkeyID
        ? this.props.route.params.item.Pro_PkeyID
        : this.props.route.params.item.PkeyID,
      Pro_IsActive: false,
      Type: 4,
    };
    try {
      token = await AsyncStorage.getItem('token');
      const res = await addupdateproducts(data, token);
      console.log('ressssss:', res);
      this.showMessage('Item Deleted');
      this.props.navigation.navigate('ShowBinData');
      this.setState({loading: false});
    } catch (error) {
      this.showerrorMessage(error.response.data.error_description);
    }
  };

  Delete = () => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this item?',
      [{text: 'DELETE', onPress: () => this.deleteItem()}, {text: 'CANCEL'}],
      {cancelable: false},
    );
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

  validateGender = value => {
    var lvalue = 0;
    switch (value) {
      // case 3: {
      //   lvalue = 'Other';
      //   break;
      // }
      case 2: {
        lvalue = 'Male';
        break;
      }
      case 1: {
        lvalue = 'Female';
        break;
      }
    }
    return lvalue;
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

  validateCeleb = value => {
    var lvalue = 0;
    switch (value) {
      case 2: {
        lvalue = 'Entourage';
        break;
      }
      case 1: {
        lvalue = 'Celebrity';
        break;
      }
    }
    return lvalue;
  };

  transferProduct = async () => {
    let data = {
      Type: 5,
      Pro_Bin_PkeyID: this.state.transferbinid,
      Pro_PkeyID: this.state.prodId,
    };
    console.log(data, 'datatata');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await addupdateproducts(data, token);
      console.log('trasnfered:', res);
      this.showMessage('Item Moved');
      this.setState({loading: false}, () => this.getToken());
    } catch (error) {
      showerrorMessage(error.response.data.error_description);
    }
  };

  render() {
    const {prodId} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <HeaderBack
          text="Item Details"
          onPress={() => this.props.navigation.goBack()}
          onimageclick={() => this.props.navigation.navigate('MyProfile')}
          image={
            this.state.photo
              ? this.state.photo
              : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
          }
        />
        <ScrollView keyboardShouldPersistTaps="handled">
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text style={styles.headertext}>{this.state.title}</Text>
            <FAB
              style={{
                backgroundColor: 'gray',
                position: 'absolute',
                right: 30,
                // top: ,
              }}
              small
              icon="camera"
              color="#fff"
              onPress={() => this.props.navigation.navigate('ScanQr', {prodId})}
            />
          </View>
          {/* <Image
            style={{
              height: 190,
              width: '90%',
              borderRadius: 2,
              marginTop: 20,
              alignSelf: 'center',
              resizeMode: 'cover',
            }}
            source={{
              uri: this.state.image_path
                ? this.state.image_path
                : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg',
            }}
          /> */}
          <View
            style={{
              marginTop: 20,
            }}>
            <SliderBox
              images={this.state.image_path}
              sliderBoxHeight={300}
              dotColor="#0F0B56"
              inactiveDotColor="#90A4AE"
              resizeMethod={'resize'}
              resizeMode={'cover'}
              ImageComponentStyle={{width: '80%'}}
              // parentWidth={windowWidth}
            />
          </View>

          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.text}>Description:</Text>
            <Text
              style={{
                color: '#ACACAC',
                fontSize: 15,
                fontWeight: 'normal',
                lineHeight: 22,
                top: 3,
                left: 5,
                width: '60%',
              }}>
              {this.state.description}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Size:</Text>
            <Text style={styles.detailtext}>{this.state.size}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Associated Cost:</Text>
            <Text style={styles.detailtext}>{this.state.associated}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Notes:</Text>
            <Text style={styles.detailtext}>{this.state.notes}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Color:</Text>
            <Text style={styles.detailtext}>
              {this.validateColor(this.state.color)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Condition:</Text>
            <Text style={styles.detailtext}>
              {this.validateCondition(this.state.condition)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Sub Category:</Text>
            <Text style={styles.detailtext}>
              {this.validateSubcategory(this.state.subcategory)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Brand Name:</Text>
            <Text style={styles.detailtext}>{this.state.brand}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Vendor Name:</Text>
            <Text style={styles.detailtext}>
              {this.validateVendor(this.state.vendor)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Product Category:</Text>
            <Text style={styles.detailtext}>
              {this.validateCategory(this.state.category)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Gender:</Text>
            <Text style={styles.detailtext}>
              {this.validateGender(this.state.gender)}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Price:</Text>
            <Text style={styles.detailtext}>{this.state.price} $</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Location:</Text>
            <Text style={styles.detailtext}>{this.state.location}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>New/Used:</Text>
            <Text style={styles.detailtext}>
              {this.validateNewused(this.state.newused)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              left: 20,
            }}>
            <Text style={styles.Subheadertext}>Celebrity/Entourage:</Text>
            <Text style={styles.detailtext}>
              {this.validateCeleb(this.state.celebrity)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              left: 20,
            }}>
            <Text style={styles.Subheadertext}>Pull:</Text>
            <AntDesign
              name={this.state.pull === true ? 'checkcircle' : 'checkcircleo'}
              color="#0F0B56"
              size={25}
              style={{paddingHorizontal: 15}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              left: 20,
            }}>
            <Text style={styles.Subheadertext}>Sold:</Text>
            <AntDesign
              name={this.state.sold === true ? 'checkcircle' : 'checkcircleo'}
              color="#0F0B56"
              size={25}
              style={{paddingHorizontal: 15}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              left: 20,
              marginBottom: 30,
            }}>
            <Text style={styles.Subheadertext}>Shot:</Text>
            <AntDesign
              name={this.state.shot === true ? 'checkcircle' : 'checkcircleo'}
              color="#0F0B56"
              size={25}
              style={{paddingHorizontal: 15}}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.Subheadertext}>Scan item’s Barcode </Text>
          </View>
          <Image
            style={{
              height: 150,
              width: 150,
              borderRadius: 2,
              // marginTop: -70,
              alignSelf: 'center',
              // resizeMode: 'contain',
              transform: [{rotate: '360deg'}],
              overflow: 'visible',
            }}
            source={{
              uri: this.state.barcodeimage ? this.state.barcodeimage : null,
            }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: '#555555',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27,
  },
  Subheadertext: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  detailtext: {
    color: '#ACACAC',
    fontSize: 15,
    fontWeight: 'normal',
    lineHeight: 22,
    top: 2,
    left: 5,
  },
  headertext: {
    color: '#000',
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '600',
    left: 20,
    width: '50%',
  },
});
