import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Select, Toast} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../../../../components/HeaderBack';
import Button from '../../../../components/Button';
import {
  getbins,
  getproducts,
  addupdateproducts,
} from '../../../../services/api.function';

export default class MoveItems extends Component {
  constructor() {
    super();
    this.state = {
      photo: '',
      loading: false,
      data: [],
      product: [],
      allbins: [],
      bin: '',
      item: '',
      binlist: '',
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', async () => {
      this.GetImage();
      this.getToken();
    });
  }

  componentWillUnmount() {
    this._unsubscribe;
  }

  GetBins = async token => {
    this.setState({
      loading: true,
    });
    const Userid = Number(await AsyncStorage.getItem('ownerid'));
    console.log('Userid data', Userid);
    var data = JSON.stringify({
      Bin_PkeyID: 1,
      Type: 3,
      Bin_PkeyID_Master: 1,
      Bin_PkeyID_Owner: Userid,
    });
    console.log(data, 'binn');
    try {
      const res = await getbins(data, token);
      console.log(res, 'redsssssssssss');
      this.setState({
        data: res[0],
        loading: false,
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({
        loading: false,
      });
    }
  };

  GetProducts = async () => {
    this.setState({
      loading: true,
    });
    var data = JSON.stringify({
      Pro_PkeyID: 1,
      Pro_Bin_PkeyID: this.state.bin,
      User_PkeyID: 1,
      Type: 3,
    });
    try {
      token = await AsyncStorage.getItem('token');
      const res = await getproducts(data, token);
      console.log(res, 'redsssssssssss');
      // setData(res[0]);
      this.setState({
        product: res[0],
        loading: false,
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({
        loading: false,
      });
    }
  };

  GetAllBins = async token => {
    this.setState({
      loading: true,
    });

    var data = JSON.stringify({
      Bin_PkeyID: 1,
      Type: 3,
      Bin_PkeyID_Master: 1,
      Bin_PkeyID_Owner: 1,
    });
    try {
      const res = await getbins(data, token);
      console.log(res, 'redsssssssssss');
      this.setState({
        allbins: res[0],
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
      if (token) {
        this.GetBins(token);
        // this.GetAllBins(token);
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
    }
  };

  GetImage = async () => {
    const imagepath = await AsyncStorage.getItem('imagepath');
    this.setState({photo: imagepath, loading: true});
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

  transferProduct = async () => {
    if (this.state.bin !== this.state.binlist) {
      let data = {
        Type: 5,
        Pro_Bin_PkeyID: this.state.binlist,
        Pro_PkeyID: this.state.item,
      };
      console.log(data, 'datatata');
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await addupdateproducts(data, token);
        console.log('ressssss:', res);
        this.showMessage('Item Moved');
        this.props.navigation.navigate('Setting');
      } catch (error) {
        showerrorMessage(error.response.data.error_description);
      }
    } else {
      this.warningMessage('Please select different bin');
    }
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <HeaderBack
          text="Move the Items"
          onPress={() => this.props.navigation.goBack()}
          onimageclick={() => this.props.navigation.navigate('MyProfile')}
          image={
            this.state.photo
              ? this.state.photo
              : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
          }
        />
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
            selectedValue={this.state.bin}
            width="90%"
            placeholder="Select the bin"
            onValueChange={itemValue =>
              this.setState({bin: itemValue}, () => this.GetProducts())
            }
            _selectedItem={{
              bg: 'gray',
            }}>
            {this.state.data.map(item => {
              return (
                <Select.Item label={item.Bin_Name} value={item.Bin_PkeyID} />
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
            selectedValue={this.state.item}
            width="90%"
            placeholder="Select item"
            onValueChange={itemValue => this.setState({item: itemValue})}
            _selectedItem={{
              bg: 'gray',
            }}>
            {this.state.product.map(item => {
              return (
                <Select.Item label={item.Pro_Name} value={item.Pro_PkeyID} />
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
            selectedValue={this.state.binlist}
            width="90%"
            placeholder="Move to"
            onValueChange={itemValue => this.setState({binlist: itemValue})}
            _selectedItem={{
              bg: 'gray',
            }}>
            {this.state.data.map(item => {
              return (
                <Select.Item label={item.Bin_Name} value={item.Bin_PkeyID} />
              );
            })}
          </Select>
        </View>
        <View style={{marginTop: 50}}>
          <Button
            text="Move"
            backgroundColor="#6633FF"
            onPress={() => {
              this.transferProduct();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
