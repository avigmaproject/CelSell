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
  TextInput,
  Animated,
  Alert,
} from 'react-native';
import {Toast, Select} from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {FAB} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import InputText from '../../components/InputText';
import {DrawerActions} from '@react-navigation/native';
import {
  userprofile,
  getbins,
  getprofiles,
  activeprofile,
  updatebin,
  getsearch,
} from '../../services/api.function';
import {setBinId, setImage} from '../../store/action/auth/action';
import {connect} from 'react-redux';

class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      bin_data: [],
      profile: [],
      name: '',
      splitname: '',
      imagepath: '',
      loading: false,
      binid: null,
      qrData: '',
      show: false,
      search: '',
      noData: false,
      binownerid: null,
      usermaster: null,
      token: '',
      profileid: '',
      activeid: null,
      userprofile: [],
      searchData: [],
      flag: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getToken();
    });
  }
  componentWillUnmount() {
    this._unsubscribe;
  }

  GetProfile = async token => {
    // alert('second');
    this.setState({
      loading: true,
    });

    var data = JSON.stringify({
      Type: 3,
    });
    try {
      const res = await getprofiles(data, token);
      this.setState({
        userprofile: res[0],
      });
      let i;
      for (i = 0; i < res[0].length; i++) {
        if (res[0][i].User_IsActive_Prof === true) {
          this.setState(
            {
              name: res[0][i].User_Name,
              imagepath: res[0][i].User_Image_Path,
              binownerid: res[0][i].User_PkeyID,
              profile: res[0][i],
            },
            () => this.split_name(),
          );
          const {binownerid} = this.state;
          AsyncStorage.setItem('ownerid', binownerid.toString());

          if (
            res[0][i].User_Image_Path != null &&
            res[0][i].User_Image_Path != undefined
          ) {
            AsyncStorage.setItem('imagepath', res[0][i].User_Image_Path);
            this.props.setImage(res[0][i].User_Image_Path);
          }
        }
      }
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      let message = '';
      if (error.response) {
        this.setState({
          loading: false,
        });
      } else {
        message = '';
      }
      console.log({message});
    }
  };

  GetBins = async () => {
    this.setState({
      loading: true,
    });
    var data = JSON.stringify({
      Bin_PkeyID: 1,
      Type: 3,
      Bin_PkeyID_Master: 1,
      Bin_PkeyID_Owner: this.state.binownerid,
    });
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await getbins(data, token);
      // console.log(res, 'resBin');
      this.setState({
        bin_data: res[0],
        initial: res[0],
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
        console.log('rishabh', token);
        // alert('first');
        this.GetProfile(token);
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
    }
  };

  searchBin = e => {
    this.setState({
      initial: this.state.bin_data.filter(i =>
        i.Bin_Name.toLowerCase().includes(e.toLowerCase()),
      ),
    });
  };

  GetSearch = async e => {
    var data = JSON.stringify({
      Type: 1,
      Dataval: e,
    });
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await getsearch(data, token);
      console.log(res[0], 'resSearch');
      this.setState({searchData: res[0]});
      const {searchData} = this.state;
      if (e !== '') {
        this.setState({
          flag: true,
        });
      } else {
        this.setState({
          flag: false,
          searchData: [],
        });
      }
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
    }
  };

  renderdata = ({item}) => {
    this.props.setBinId(item);
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ShowBinData', {item})}>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // justifyContent: 'center',
            }}>
            <View
              style={{
                height: 70,
                width: '25%',
                borderWidth: 0.5,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                marginLeft: 10,
                borderColor: 'grey',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: '700',
                  lineHeight: 26,
                  color: '#000000',
                }}>
                {item.Bin_QR_Data}
              </Text>
            </View>

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
                backgroundColor: '#A792FF',
                position: 'absolute',
                right: 20,
                top: 25,
              }}
              icon="pencil"
              color="#fff"
              small
              onPress={() => this.props.navigation.navigate('EditBin', {item})}
            />
            <FAB
              style={{
                backgroundColor: '#A792FF',
                position: 'absolute',
                right: 70,
                top: 25,
              }}
              icon="qrcode"
              color="#fff"
              small
              onPress={() => this.props.navigation.navigate('QrCode', {item})}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  split_name = () => {
    const words = this.state.name.split(' ');
    this.setState(
      {
        splitname: words[0],
      },
      () => this.GetBins(),
    );
  };

  activateProfile = async () => {
    this.setState({
      loading: true,
    });
    let data = {
      Type: 9,
      User_PkeyID: this.state.profileid,
      User_IsActive_Prof: true,
    };
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await activeprofile(data, token);
      this.setState(
        {
          loading: false,
          activeid: res[0][0],
        },
        () => this.GetActiveProfile(),
      );
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      this.setState({
        loading: false,
      });
    }
  };

  GetActiveProfile = async () => {
    this.setState({
      loading: true,
    });
    var data = JSON.stringify({
      Type: 4,
      User_PkeyID: this.state.activeid,
    });
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await getprofiles(data, token);
      this.setState(
        {
          name: res[0][0].User_Name,
          imagepath: res[0][0].User_Image_Path,
          binownerid: res[0][0].User_PkeyID,
          loading: false,
        },
        () => this.getToken(),
      );
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      let message = '';
      if (error.response) {
        this.setState({
          loading: false,
        });
      } else {
        message = '';
      }
      console.log({message});
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
  rendersearchdata = ({item}) => {
    return (
      <TouchableOpacity
        onPress={
          item.stype === 1
            ? () => this.props.navigation.navigate('ShowBinData', {item})
            : () => this.props.navigation.navigate('ItemDetails', {item})
        }
        style={{
          marginTop: 15,
          height: 110,
          backgroundColor: '#FFF',
          borderRadius: 3,
          shadowColor: 'grey',
          shadowOpacity: 0.8,
          shadowRadius: 2,
          shadowOffset: {
            height: 2,
            width: 2,
          },
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'center',
          }}>
          {item.stype === 1 ? (
            <View
              style={{
                height: 70,
                width: '25%',
                borderWidth: 0.5,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                marginLeft: 10,
                borderColor: 'grey',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: '700',
                  lineHeight: 26,
                  color: '#000000',
                }}>
                {item.iqpath}
              </Text>
            </View>
          ) : (
            <Image
              style={{
                height: 90,
                width: 90,
                borderRadius: 1,
                borderColor: '#BDBDBD',
                borderWidth: 1,
                left: 10,
                top: 10,
              }}
              source={{
                uri: item.iqpath
                  ? item.iqpath
                  : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg',
              }}
            />
          )}

          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'column',
              paddingLeft: 25,
              paddingTop: 10,
              width: '70%',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                lineHeight: 20,
                color: '#0F0B56',
              }}>
              {item.pbName}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                lineHeight: 20,
                color: '#ACACAC',
              }}>
              {item.stype === 2 ? item.pbDesc : item.brandlocation}
            </Text>
          </View>
          {item.stype === 1 ? (
            <FAB
              style={{
                backgroundColor: '#A792FF',
                position: 'absolute',
                right: 20,
                top: 25,
              }}
              icon="pencil"
              color="#fff"
              small
              onPress={() => this.props.navigation.navigate('EditBin', {item})}
            />
          ) : null}

          {item.stype === 1 ? (
            <FAB
              style={{
                backgroundColor: '#A792FF',
                position: 'absolute',
                right: 70,
                top: 25,
              }}
              icon="qrcode"
              color="#fff"
              small
              onPress={() => this.props.navigation.navigate('QrCode', {item})}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {profile, flag} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <Spinner visible={this.state.loading} />
        <View
          style={{
            backgroundColor: '#fff',
            height: 150,
          }}>
          <View
            style={{
              justifyContent: 'center',
              // alignItems: 'center',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.dispatch(DrawerActions.openDrawer())
              }
              style={{position: 'absolute', left: 20}}>
              <Entypo name="menu" size={30} color="#0F0B56" />
            </TouchableOpacity>
            <View
              style={{
                position: 'absolute',
                right: 45,
                //   borderColor:"#FFFFFF"
              }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('MyProfile')}>
                <Image
                  style={{
                    height: 45,
                    width: 45,
                    borderRadius: 45,
                    borderColor: '#BDBDBD',
                    borderWidth: 1,
                  }}
                  source={{
                    uri: this.state.imagepath
                      ? this.state.imagepath
                      : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', paddingRight: 50}}>
              <Text style={styles.heading}>Hi </Text>
              <Text style={styles.heading}>{this.state.splitname}</Text>
            </View>

            <View style={{position: 'absolute', right: 20}}>
              <Select
                // dropdownIcon
                variant="unstyled"
                style={{
                  fontSize: 20,
                  paddingLeft: 20,
                  color: '#000000',
                  fontWeight: '600',
                  height: 40,
                  borderColor: 'transparent',
                  borderWidth: 0,
                }}
                minWidth="75"
                selectedValue={false}
                // placeholder={this.state.name}
                placeholderTextColor="#FFFFFF"
                onValueChange={itemValue =>
                  this.setState({profileid: itemValue}, () =>
                    this.activateProfile(),
                  )
                }
                _selectedItem={{
                  bg: 'gray',
                }}>
                {this.state.userprofile.map(item => {
                  return (
                    <Select.Item
                      label={item.User_Name}
                      value={item.User_PkeyID}
                    />
                  );
                })}
              </Select>
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <TextInput
              style={{
                height: 50,
                margin: 12,
                // borderWidth: 1,
                width: '90%',
                alignSelf: 'center',
                padding: 10,
                backgroundColor: '#F8F8F8',
                borderRadius: 6,
                color: '#000000',
              }}
              autoCapitalize="none"
              onChangeText={e => this.GetSearch(e)}
              // value={number}
              placeholder="Your bins search here"
              placeholderTextColor="#ACACAC"
            />
            <TouchableOpacity
              // onPress={props.onPress}
              style={{position: 'absolute', right: 30, top: 20, zindex: 1}}>
              <Feather name="search" size={30} color="#ACACAC" />
            </TouchableOpacity>
          </View>
        </View>

        {flag ? (
          <FlatList
            data={this.state.searchData}
            renderItem={item => this.rendersearchdata(item)}
            keyExtractor={item => item.PkeyID}
            style={{marginTop: 5, marginBottom: 10}}
          />
        ) : (
          <FlatList
            data={this.state.bin_data}
            renderItem={item => this.renderdata(item)}
            keyExtractor={item => item.Bin_PkeyID}
            style={{marginTop: 5, marginBottom: 10}}
          />
        )}

        {this.state.bin_data != '' ? (
          <FAB
            style={{
              backgroundColor: '#0F0B56',
              position: 'absolute',
              bottom: 80,
              right: 30,
            }}
            icon="plus"
            color="#fff"
            onPress={() =>
              this.props.navigation.navigate('CreateBin', {profile})
            }
          />
        ) : (
          <View style={{flex: 2}}>
            <View style={{alignSelf: 'center', bottom: 25}}>
              <Text style={{fontSize: 20, fontWeight: '600', color: 'grey'}}>
                No Bin Found
              </Text>
            </View>
            <View>
              <FAB
                style={{
                  backgroundColor: '#0F0B56',
                  position: 'absolute',
                  alignSelf: 'center',
                }}
                icon="plus"
                label="Add Bin"
                color="#fff"
                onPress={() =>
                  this.props.navigation.navigate('CreateBin', {profile})
                }
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    color: '#0F0B56',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
});

const mapDispatchToProps = {
  setBinId,
  setImage,
};
const mapStateToProps = (state, ownProps) => ({
  // contacts: state.contactReducer.contacts,
  // parentid: state.parentidReducer.parentid,
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
