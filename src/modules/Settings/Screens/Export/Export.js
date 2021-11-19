import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Select, Toast} from 'native-base';
import HeaderBack from '../../../../components/HeaderBack';
import InputView from '../../Components/InputView';
import {getbins} from '../../../../services/api.function';

export default class Export extends Component {
  constructor() {
    super();
    this.state = {
      photo: '',
      loading: false,
      data: [],
      bin: '',
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.GetImage();
      this.getToken();
    });
  }

  componentWillUnmount() {
    this._unsubscribe;
  }

  GetImage = async () => {
    const imagepath = await AsyncStorage.getItem('imagepath');
    this.setState({photo: imagepath, loading: true});
  };

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

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <View>
          <HeaderBack
            text="Export"
            onPress={() => this.props.navigation.goBack()}
            onimageclick={() => this.props.navigation.navigate('MyProfile')}
            image={
              this.state.photo
                ? this.state.photo
                : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
            }
          />
        </View>

        <Image
          source={require('../../../../assets/Image/Export.png')}
          style={{
            width: '45%',
            height: '30%',
            resizeMode: 'contain',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        />

        <View style={{marginTop: 80, alignItems: 'center'}}>
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
            onValueChange={itemValue => this.setState({bin: itemValue})}
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
          <InputView
            text="EXPORT AS PDF"
            Image={require("'../../../../assets/Image/Pdf.png")}
          />
        </View>
        <View style={{marginTop: 20}}>
          <InputView
            text="EXPORT AS CSV"
            Image={require("'../../../../assets/Image/Csv.png")}
          />
        </View>
      </SafeAreaView>
    );
  }
}
