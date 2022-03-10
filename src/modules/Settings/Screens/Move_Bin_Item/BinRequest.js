import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../../../../components/HeaderBack';
import {getbins, updatebin} from '../../../../services/api.function';
import {FAB} from 'react-native-paper';

export default class BinRequest extends Component {
  constructor() {
    super();
    this.state = {
      photo: '',
      loading: false,
      bins: [],
      binpkeyid: null,
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
    console.log(Userid, 'Userid');
    var data = JSON.stringify({
      Type: 4,
      Bin_PkeyID_Owner: Userid,
    });
    try {
      const res = await getbins(data, token);
      console.log(res, 'transfer');
      this.setState({
        bins: res[0],
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
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
    }
  };

  acceptReq = async () => {
    this.setState({
      loading: true,
    });

    var data = JSON.stringify({
      Type: 7,
      Bin_PkeyID: this.state.binpkeyid,
    });
    this.setState(
      {
        loading: false,
      },
      () => this.GetBins(),
    );
    try {
      const res = await updatebin(data);
      console.log(res, 'accept');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({
        loading: false,
      });
    }
  };

  rejectReq = async () => {
    this.setState({
      loading: true,
    });

    var data = JSON.stringify({
      Type: 8,
      Bin_PkeyID: this.state.binpkeyid,
    });
    this.setState(
      {
        loading: false,
      },
      () => this.GetBins(),
    );
    try {
      const res = await updatebin(data);
      console.log(res, 'reject');
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({
        loading: false,
      });
    }
  };

  renderdata = ({item}) => {
    return (
      <TouchableOpacity>
        <View
          style={{
            marginTop: 15,
            height: 90,
            backgroundColor: '#FFF',
            borderRadius: 3,
            shadowColor: 'grey',
            shadowOpacity: 0.8,
            shadowRadius: 2,
            shadowOffset: {
              height: 2,
              width: 2,
            },
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                height: 70,
                width: 70,
                borderRadius: 1,
                borderColor: '#BDBDBD',
                borderWidth: 1,
                left: 10,
                top: 10,
              }}
              source={{
                uri: item.Bin_Image_Path
                  ? item.Bin_Image_Path
                  : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg',
              }}
            />
            <View
              style={{
                justifyContent: 'center',
                flexDirection: 'column',
                paddingLeft: 25,
                paddingTop: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  lineHeight: 20,
                  color: '#0F0B56',
                }}>
                {item.Bin_Name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  lineHeight: 20,
                  color: '#ACACAC',
                }}>
                {item.Loc_Name}
              </Text>
            </View>
            <FAB
              style={{
                backgroundColor: 'red',
                position: 'absolute',
                right: 20,
                top: 25,
              }}
              icon="close"
              color="#fff"
              small
              onPress={() => {
                this.setState({binpkeyid: item.Bin_PkeyID}, () =>
                  this.rejectReq(),
                );
              }}
            />
            <FAB
              style={{
                backgroundColor: 'lightgreen',
                position: 'absolute',
                right: 75,
                top: 25,
              }}
              icon="check"
              color="#fff"
              small
              onPress={() => {
                this.setState({binpkeyid: item.Bin_PkeyID}, () =>
                  this.acceptReq(),
                );
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    console.log(this.state.bins);
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <HeaderBack
          text="Bin Request"
          onPress={() => this.props.navigation.goBack()}
          onimageclick={() => this.props.navigation.navigate('MyProfile')}
          image={
            this.state.photo
              ? this.state.photo
              : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
          }
        />

        <FlatList
          data={this.state.bins}
          renderItem={item => this.renderdata(item)}
          style={{marginTop: 5, marginBottom: 10}}
        />
        {this.state.bins != '' ? null : (
          <View style={{flex: 2, alignSelf: 'center'}}>
            <Text style={{fontSize: 20, fontWeight: '600', color: 'grey'}}>
              No request found
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}
