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
} from 'react-native';
import {Select, Toast} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import Feather from 'react-native-vector-icons/Feather';
import {FAB} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../../../components/HeaderBack';
import {getproducts, addupdateproducts} from '../../../services/api.function';

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
      vendor: '',
      condition: '',
      celebrity: '',
      newused: null,
      clicks: 0,
      show: false,
      imagepath: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.GetImage();
      this.getToken();
    });
  }

  GetImage = async () => {
    const image = await AsyncStorage.getItem('imagepath');
    this.setState({photo: image});
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
      this.setState({
        description: res[0][0].Pro_Desc,
        title: res[0][0].Pro_Name,
        imagepath: res[0][0].ProImage_ImagePath,
        brand: res[0][0].Pro_BrandName,
        gender: res[0][0].Pro_Gender,
        color: res[0][0].Pro_Color,
        size: res[0][0].Pro_Size,
        vendor: res[0][0].Pro_Vendor_Name,
        condition: res[0][0].Pro_Condition,
        celebrity: res[0][0].Pro_Celeb_Name,
        newused: res[0][0].Pro_new_Used,
        price: res[0][0].Pro_Price,
        category: res[0][0].Pro_Category,
        subcategory: res[0][0].Pro_SubCategory,
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
      Pro_PkeyID: this.props.route.params.item.Pro_PkeyID,
      Pro_IsActive: false,
      Type: 4,
    };
    try {
      token = await AsyncStorage.getItem('token');
      const res = await addupdateproducts(data, token);
      console.log('ressssss:', res);
      this.showMessage('Item Deleted');
      this.props.navigation.navigate('ItemList');
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
      case 3: {
        lvalue = 'Other';
        break;
      }
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
      case true: {
        lvalue = 'New';
        break;
      }
      case false: {
        lvalue = 'Used';
        break;
      }
    }
    return lvalue;
  };

  render() {
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
            <Text
              style={{
                color: '#555555',
                fontSize: 20,
                lineHeight: 30,
                fontWeight: '600',
                left: 25,
              }}>
              {this.state.title}
            </Text>
            <FAB
              style={{
                backgroundColor: 'red',
                // position: 'absolute',
                right: 30,
                // top: ,
              }}
              small
              icon="delete"
              color="#fff"
              onPress={() => this.Delete()}
            />
          </View>
          <Image
            style={{
              height: 190,
              width: '90%',
              borderRadius: 2,
              marginTop: 20,
              alignSelf: 'center',
              resizeMode: 'cover',
            }}
            source={{
              uri: this.state.imagepath,
            }}
          />
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.headertext}>Description:</Text>
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
            <Text style={styles.Subheadertext}>Color:</Text>
            <Text style={styles.detailtext}>{this.state.color}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Condition:</Text>
            <Text style={styles.detailtext}>{this.state.condition}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Sub Category:</Text>
            <Text style={styles.detailtext}>{this.state.subcategory}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Brand Name:</Text>
            <Text style={styles.detailtext}>{this.state.brand}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Vendor Name:</Text>
            <Text style={styles.detailtext}>{this.state.vendor}</Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
            <Text style={styles.Subheadertext}>Product Category:</Text>
            <Text style={styles.detailtext}>{this.state.category}</Text>
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
              marginBottom: 30,
            }}>
            <Text style={styles.Subheadertext}>Celebrity/Entourage:</Text>
            <Text style={styles.detailtext}>{this.state.celebrity}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  headertext: {
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
});
