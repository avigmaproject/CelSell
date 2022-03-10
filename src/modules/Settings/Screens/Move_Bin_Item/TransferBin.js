import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {Select, Toast} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import Entypo from 'react-native-vector-icons/Entypo';

import HeaderBack from '../../../../components/HeaderBack';
import Button from '../../../../components/Button';
import {
  getprofiles,
  getbins,
  updatebin,
} from '../../../../services/api.function';
import InputSearch from '../../Components/InputSearch';

export default class TransferBin extends Component {
  constructor() {
    super();
    this.state = {
      photo: '',
      dataSender: [],
      data_receiver: [],
      filteredReciever: [],
      filteredSender: [],
      filteredBin: [],
      bins: [],
      binvalue: '',
      profilesender: null,
      profilereceiver: null,
      loading: false,
      value: null,
      open: false,
      profilereceiveremail: null,
      profilesenderemail: null,
      binName: null,
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
      data_receiver: callback(state.data_receiver),
    }));
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

  setOpen() {
    this.setState({
      open: !this.state.open,
    });
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
        dataSender: res[0],
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

  GetProfileforReciever = async token => {
    this.setState({loading: true});
    var data = JSON.stringify({
      Type: 1,
    });
    try {
      const res = await getprofiles(data, token);

      const itemlist = res[0].map(item => ({
        label: item.User_Email,
        value: item.User_PkeyID,
      }));

      console.log(itemlist, 'itemlist');

      this.setState({
        data_receiver: res[0],
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
        this.GetProfileforReciever(token);
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
    console.log(this.state.profilesender, 'this.state.profilesender');
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

  Validation = () => {
    let cancel = false;
    if (this.state.profilesender === null) {
      cancel = true;
    }
    if (this.state.binvalue === null) {
      cancel = true;
    }
    if (this.state.profilereceiver === null) {
      cancel = true;
    }
    if (cancel) {
      this.warningMessage('Please fill all details');
      return false;
    } else {
      return true;
    }
  };

  ProfileValidation = () => {
    if (this.state.profilereceiver === this.state.profilesender) {
      this.warningMessage('Please select different profile');
    }
  };
  transferBin = async () => {
    if (this.Validation() || this.ProfileValidation()) {
      let data = {
        Type: 6,
        Bin_PkeyID: this.state.binvalue,
        Bin_PkeyID_Owner: this.state.profilereceiver,
      };
      console.log(data, 'datatata');
      // try {
      const token = await AsyncStorage.getItem('token');
      const res = await updatebin(data, token);
      console.log('ressssss:', res);
      this.showMessage('Request sent');
      this.props.navigation.navigate('Setting');
      // } catch (error) {
      //   this.warningMessage(error.response.data.error_description);
      // }
    }
  };

  showMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      Toast.show({
        title: message,
        placement: 'bottom',
        status: 'success',
        duration: 1000,
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
        duration: 1000,
      });
    }
  };

  smartDropDownForSender = e => {
    if (e) {
      this.setState({
        filteredSender: this.state.dataSender.filter(i =>
          i.User_Email.toLowerCase().includes(e.toLowerCase()),
        ),
      });
    } else {
      this.setState({filteredSender: []});
    }
  };

  smartBinSearch = e => {
    if (e) {
      this.setState({
        filteredBin: this.state.bins.filter(i =>
          i.Bin_Name.toLowerCase().includes(e.toLowerCase()),
        ),
      });
    } else {
      this.setState({filteredBin: []});
    }
  };

  smartDropDownForReciever = e => {
    if (e) {
      this.setState({
        filteredReciever: this.state.data_receiver.filter(i =>
          i.User_Email.toLowerCase().includes(e.toLowerCase()),
        ),
      });
      console.log(this.state.filteredReciever, 'filteredReciever');
    } else {
      this.setState({filteredReciever: []});
    }
  };

  renderdataForTransfer = ({item}) => {
    return (
      <TouchableOpacity
        style={{marginTop: 20, marginLeft: 25, marginBottom: 5}}
        onPress={() =>
          this.setState(
            {
              profilesender: item.User_PkeyID,
              filteredSender: [],
              profilesenderemail: item.User_Email,
            },
            () => this.GetBins(),
          )
        }>
        <Text style={{color: '#000'}}>{item.User_Email}</Text>
      </TouchableOpacity>
    );
  };

  renderBin = ({item}) => {
    return (
      <TouchableOpacity
        style={{marginTop: 20, marginLeft: 25, marginBottom: 5}}
        onPress={() =>
          this.setState(
            {
              binvalue: item.Bin_PkeyID,
              filteredBin: [],
              binName: item.Bin_Name,
            },
            () => this.GetBins(),
          )
        }>
        <Text style={{color: '#000000'}}>{item.Bin_Name}</Text>
      </TouchableOpacity>
    );
  };

  renderdataForReciever = ({item}) => {
    console.log(item, 'list');
    return (
      <TouchableOpacity
        style={{marginTop: 20, marginLeft: 25, marginBottom: 5}}
        onPress={() =>
          this.setState({
            profilereceiver: item.User_PkeyID,
            filteredReciever: [],
            profilereceiveremail: item.User_Email,
          })
        }>
        <Text style={{color: '#000'}}>{item.User_Email}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {data_receiver} = this.state;
    // const data = filterData(data_receiver);
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
        {/* <View style={{marginTop: 50, alignItems: 'center'}}>
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
            {this.state.dataSender.map(item => {
              return (
                <Select.Item label={item.User_Email} value={item.User_PkeyID} />
              );
            })}
          </Select>
        </View> */}
        <View>
          <InputSearch
            onChangeText={e => this.smartDropDownForSender(e)}
            value={this.state.profilesenderemail}
            placeholder="Select profile from which to transfer the bins"
            placeholderTextColor="gray"
            data={this.state.filteredSender}
            renderItem={item => this.renderdataForTransfer(item)}
            keyExtractor={item => item.User_PkeyID}
          />
          {this.state.profilesenderemail !== null ? (
            <TouchableOpacity
              style={styles.cross}
              onPress={() =>
                this.setState({
                  profilesenderemail: null,
                })
              }>
              <Entypo name="cross" color="#0F0B56" size={25} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* {this.state.filteredSender === [] ? (
          <View>
            <Text style={{color: 'red'}}>Bin Not Found</Text>
          </View>
        ) : (
          <View>
            <Text>hello</Text>
          </View>
        )} */}
        <View>
          <InputSearch
            onChangeText={e => this.smartBinSearch(e)}
            value={this.state.binName}
            placeholder="Select Bin"
            placeholderTextColor="gray"
            data={this.state.filteredBin}
            renderItem={item => this.renderBin(item)}
            keyExtractor={item => item.Bin_PkeyID}
          />
          {this.state.binName !== null ? (
            <TouchableOpacity
              style={styles.cross}
              onPress={() =>
                this.setState({
                  binName: null,
                })
              }>
              <Entypo name="cross" color="#0F0B56" size={25} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* <View style={{marginTop: 20, alignItems: 'center'}}>
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
        </View> */}
        <View>
          <InputSearch
            onChangeText={e => this.smartDropDownForReciever(e)}
            value={this.state.profilereceiveremail}
            placeholder="Select profile to transfer the bins"
            placeholderTextColor="gray"
            data={this.state.filteredReciever}
            renderItem={item => this.renderdataForReciever(item)}
            keyExtractor={item => item.User_PkeyID}
          />
          {this.state.profilereceiveremail !== null ? (
            <TouchableOpacity
              style={styles.cross}
              onPress={() =>
                this.setState({
                  profilereceiveremail: null,
                })
              }>
              <Entypo name="cross" color="#0F0B56" size={25} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={{marginTop: 50}}>
          <Button
            text="Send Request"
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    // flex: 1,
    // padding: 16,
    marginTop: 40,
    width: '90%',
    // height: 65,
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    height: 65,
  },
  descriptionContainer: {
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
    fontColor: '#000',
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
  cross: {
    position: 'absolute',
    right: 25,
    top: 40,
  },
});
