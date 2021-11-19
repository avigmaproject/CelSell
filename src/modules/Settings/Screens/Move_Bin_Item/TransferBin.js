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
  getprofiles,
  getbins,
  updatebin,
} from '../../../../services/api.function';

export default class TransferBin extends Component {
  constructor() {
    super();
    this.state = {
      photo: '',
      data: [],
      bins: [],
      binvalue: '',
      profilesender: '',
      profilereceiver: '',
      loading: false,
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

  GetImage = async () => {
    const imagepath = await AsyncStorage.getItem('imagepath');
    this.setState({photo: imagepath, loading: true});
  };

  GetProfile = async token => {
    this.setState({loading: true});
    var data = JSON.stringify({
      Type: 3,
    });
    try {
      const res = await getprofiles(data, token);
      this.setState({
        data: res[0],
        loading: false,
      });
      console.log(res, 'profilesss');
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

  getToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('token');
      if (token) {
        this.GetProfile(token);
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
    }
  };

  GetBins = async token => {
    this.setState({
      loading: true,
    });
    var data = JSON.stringify({
      Bin_PkeyID: 1,
      Type: 3,
      Bin_PkeyID_Master: 1,
      Bin_PkeyID_Owner: this.state.profilesender,
    });
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await getbins(data, token);
      console.log(res, 'redsssssssssss');
      this.setState({
        bins: res[0],
        loading: false,
      });
      // console.log(res[0], 'res[0][0]res[0][0]');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({
        loading: false,
      });
    }
  };

  transferBin = async () => {
    if (this.state.profilereceiver !== this.state.profilesender) {
      let data = {
        Type: 6,
        Bin_PkeyID: this.state.binvalue,
        Bin_PkeyID_Owner: this.state.profilereceiver,
      };
      console.log(data, 'datatata');
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await updatebin(data, token);
        console.log('ressssss:', res);
        this.showMessage('Bin Moved');
        this.props.navigation.navigate('Setting');
      } catch (error) {
        showerrorMessage(error.response.data.error_description);
      }
    } else {
      this.warningMessage('Please select different profile');
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

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <HeaderBack
          text="Transfer Bin"
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
              height: 55,
              backgroundColor: '#fff',
            }}
            selectedValue={this.state.profilesender}
            width="90%"
            placeholder="Select profile from which to transfer the bins"
            onValueChange={itemValue =>
              this.setState({profilesender: itemValue}, () => this.GetBins())
            }
            _selectedItem={{
              bg: 'gray',
            }}>
            {this.state.data.map(item => {
              return (
                <Select.Item label={item.User_Name} value={item.User_PkeyID} />
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
            selectedValue={this.state.binvalue}
            width="90%"
            placeholder="Select Bin"
            onValueChange={itemValue => this.setState({binvalue: itemValue})}
            _selectedItem={{
              bg: 'gray',
            }}>
            {this.state.bins.map(item => {
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
              height: 55,
              backgroundColor: '#fff',
            }}
            selectedValue={this.state.profilereceiver}
            width="90%"
            placeholder="Select profile to transfer the bins"
            onValueChange={itemValue =>
              this.setState({profilereceiver: itemValue})
            }
            _selectedItem={{
              bg: 'gray',
            }}>
            {this.state.data.map(item => {
              return (
                <Select.Item label={item.User_Name} value={item.User_PkeyID} />
              );
            })}
          </Select>
        </View>
        <View style={{marginTop: 50}}>
          <Button
            text="Move"
            backgroundColor="#6633FF"
            onPress={() => {
              this.transferBin();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
