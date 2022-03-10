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
  FlatList,
  Alert,
  Animated,
} from 'react-native';
import {FAB} from 'react-native-paper';
import {
  getbins,
  getproducts,
  addupdateproducts,
} from '../../../services/api.function';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBackWithSearchBar from '../../../components/HeaderBackWithSearchBar';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../../../components/Button';
import HiddenItemWithActions from '../Components/HiddenItemWithActions';
import {Toast} from 'native-base';
import {SwipeListView} from 'react-native-swipe-list-view';

import {connect} from 'react-redux';

class ShowBinData extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      photo: '',
      imagepath: '',
      data: [],
      name: '',
      location: '',
      unit: null,
      shelf: null,
      binid: null,
      column: null,
      loading: false,
      initial: [],
      product: [],
      productid: null,
      transferbinid: null,
      token: '',
    };
  }
  componentDidMount() {
    const {navigation} = this.props;
    this._unsubscribe = navigation.addListener('focus', () => {
      this.getToken();
      this.GetImage();

      console.log('hiiiii', this.props.route.params);

      if (this.props.route.params) {
        const {link} = this.props.route.params;
        if (link) {
          console.log('showbin', link);
          const spliturl = link.split('/');
          console.log('spliturl', spliturl[4]);
          this.setState({transferbinid: spliturl[4]}, () =>
            this.transferProduct(),
          );
        } else if (this.props.route.params.item.Bin_PkeyID) {
          this.setState({
            id: this.props.route.params.item.Bin_PkeyID,
          });
        } else if (this.props.route.params.item.PkeyID) {
          this.setState({
            id: this.props.route.params.item.PkeyID,
          });
        }
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe;
  }

  GetImage = async () => {
    const image = await AsyncStorage.getItem('imagepath');
    this.setState({photo: image, loading: true});
  };

  GetBins = async token => {
    this.setState({loading: true});
    var data = JSON.stringify({
      Bin_PkeyID: this.state.id,
      Type: 2,
    });
    try {
      const res = await getbins(data, token);
      // console.log(res, 'red');
      this.setState({
        data: res[0],
        imagepath: res[0][0].Bin_Image_Path,
        name: res[0][0].Bin_Name,
        location: res[0][0].Loc_Name,
        unit: res[0][0].Bin_Unit,
        shelf: res[0][0].Bin_Shelf,
        binid: res[0][0].Bin_PkeyID,
        column: res[0][0].Bin_Column,
        loading: false,
      });
    } catch (error) {
      this.setState({loading: false});
      console.log('hihihihihihih', {e: error.response.data.error});
    }
  };

  GetProducts = async token => {
    this.setState({loading: true});
    var data = JSON.stringify({
      Pro_PkeyID: 1,
      Pro_Bin_PkeyID: this.state.id,
      User_PkeyID: 1,
      Type: 3,
    });
    try {
      const res = await getproducts(data, token);
      // console.log(res, 'productdetails');
      this.setState({
        product: res[0],
        initial: res[0],
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
        this.setState({token});
        this.GetBins(token);
        this.GetProducts(token);
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
    }
  };

  item = name => {
    const {data} = this.state;
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ItemList', {data})}
        style={{
          right: 25,
          flexDirection: 'row',
          backgroundColor: '#E5DFF5',
          height: 35,
          width: 110,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Feather name="database" size={24} color="#6633FF" />
        <Text
          style={{
            color: '#6633FF',
            fontSize: 18,
            lineHeight: 21,
            fontWeight: '500',
            paddingLeft: 5,
          }}>
          Items
        </Text>
      </TouchableOpacity>
    );
  };

  searchItem = e => {
    this.setState({
      initial: this.state.product.filter(
        i =>
          i.Pro_Name.toLowerCase().includes(e.toLowerCase()) ||
          i.Pro_Desc.toLowerCase().includes(e.toLowerCase()),
      ),
    });
  };

  renderdata = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ItemDetails', {item})}
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
        <View style={{flexDirection: 'row'}}>
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
              uri: item.ProImage_ImagePath
                ? item.ProImage_ImagePath
                : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg',
            }}
          />
          <View
            style={{
              marginLeft: 25,
              marginTop: 10,
              width: '70%',
            }}>
            <Text
              // numberOfLines={1}
              // ellipsizeMode="tail"
              style={{
                color: '#0F0B56',
                fontSize: 16,
                lineHeight: 20,
                fontWeight: '600',
              }}>
              {item.Pro_Name}
            </Text>

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: '#ACACAC',
                fontSize: 14,
                lineHeight: 24,
                fontWeight: 'normal',
                // width: '25%',
              }}>
              {item.Pro_Desc}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: '#6633FF',
                  fontSize: 14,
                  lineHeight: 24,
                  fontWeight: '500',
                }}>
                Quantity:{' '}
              </Text>
              <Text
                style={{
                  color: '#6633FF',
                  fontSize: 14,
                  lineHeight: 24,
                  fontWeight: '500',
                }}>
                {item.Pro_Qty}
              </Text>
            </View>
          </View>
        </View>
        {/* <FAB
            style={{
              backgroundColor: 'red',
              position: 'absolute',
              right: 20,
              bottom: 15,
            }}
            small
            icon="delete"
            color="#fff"
            onPress={() =>
              this.setState({productid: item.Pro_PkeyID}, () => this.Delete())
            }
          /> */}
        <FAB
          style={{
            backgroundColor: '#A792FF',
            position: 'absolute',
            right: 20,
            bottom: 15,
          }}
          icon="pencil"
          color="#fff"
          small
          onPress={() => this.props.navigation.navigate('EditItem', {item})}
        />
      </TouchableOpacity>
    );
  };

  deleteItem = async () => {
    this.setState({loading: false});
    let data = {
      Pro_PkeyID: this.state.productid,
      Pro_IsActive: false,
      Type: 4,
    };
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await addupdateproducts(data, token);
      console.log('ressssss:', res);
      this.showMessage('Item Deleted');
      this.setState({loading: false}, () => this.getToken());
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

  renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);
    // console.log(data.item, 'datatata');
    const value = data.item.Pro_PkeyID;
    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onClose={() => this.closeRow(rowMap, data.item.Pro_PkeyID)}
        onCameraPress={() =>
          this.setState({productid: value}, () =>
            this.props.navigation.navigate('ScanQr'),
          )
        }
        onDelete={() =>
          this.setState({productid: data.item.Pro_PkeyID}, () => this.Delete())
        }
      />
    );
  };

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  onLeftActionStatusChange = rowKey => {
    console.log('onLeftActionStatusChange', rowKey);

    this.setState({productid: rowKey.key}, () => this.Delete());
  };

  onRightActionStatusChange = rowKey => {
    console.log('onRightActionStatusChange', rowKey);
    this.setState({productid: rowKey.key}, () =>
      this.props.navigation.navigate('ScanQr'),
    );
  };

  onRightAction = (rowMap, rowKey) => {
    console.log('onRightAction', rowKey);
    this.closeRow(rowMap, rowKey);
  };

  onLeftAction = rowKey => {
    console.log('onLeftAction', rowKey);
  };

  transferProduct = async () => {
    console.log(this.props.productData, 'id ayaya');
    let data = {
      Type: 5,
      Pro_Bin_PkeyID: this.state.transferbinid,
      Pro_PkeyID: this.props.productData
        ? this.props.productData
        : this.state.productid,
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
    const {id} = this.state;
    console.log(this.props.profileImage, 'L');
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <HeaderBackWithSearchBar
          text1={this.state.name}
          onPress={() => this.props.navigation.goBack()}
          onimageclick={() => this.props.navigation.navigate('MyProfile')}
          image={
            this.props.profileImage
              ? this.props.profileImage
              : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
          }
          onChangeText={e => this.searchItem(e)}
        />
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <Text
            style={{
              color: '#000000',
              fontSize: 20,
              lineHeight: 30,
              fontWeight: '600',
              left: 25,
            }}>
            {this.state.name}
          </Text>
          {this.item()}
        </View> */}
        {/* <Image
          style={{
            height: '40%',
            width: '90%',
            borderRadius: 2,
            marginTop: 20,
            alignSelf: 'center',
          }}
          resizeMode="contain"
          source={require('../../../assets/Image/bin.png')}
        /> */}
        {/* <View style={{flexDirection: 'row', marginTop: 40, left: 25}}>
          <Text
            style={{
              color: '#000',
              fontSize: 18,
              fontWeight: '500',
              lineHeight: 27,
            }}>
            Location :
          </Text>
          <Text style={styles.detailtext}>{this.state.location}</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20, left: 25}}>
          <Text style={styles.headertext}>Unit :</Text>
          <Text style={styles.detailtext}>{this.state.unit}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            left: 25,
          }}>
          <Text style={styles.headertext}>Shelf :</Text>
          <Text style={styles.detailtext}>{this.state.shelf}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            left: 25,
          }}>
          <Text style={styles.headertext}>Column :</Text>
          <Text style={styles.detailtext}>{this.state.column}</Text>
        </View> */}
        {/* <FlatList
          data={this.state.initial}
          renderItem={item => this.renderdata(item)}
          style={{marginTop: 5, marginBottom: 10}}
        /> */}
        <SwipeListView
          data={this.state.initial}
          renderItem={item => this.renderdata(item)}
          renderHiddenItem={(data, rowMap) =>
            this.renderHiddenItem(data, rowMap)
          }
          keyExtractor={item => item.Pro_PkeyID}
          // disableRightSwipe
          leftOpenValue={155}
          rightOpenValue={-160}
          onRowDidOpen={rowKey => this.onRowDidOpen(rowKey)}
          leftActivationValue={250}
          rightActivationValue={-200}
          leftActionValue={0}
          rightActionValue={-500}
          onLeftAction={rowKey => this.onLeftAction(rowKey)}
          onRightAction={rowKey => this.onRightAction(rowKey)}
          onLeftActionStatusChange={rowKey =>
            this.onLeftActionStatusChange(rowKey)
          }
          onRightActionStatusChange={rowKey =>
            this.onRightActionStatusChange(rowKey)
          }
        />

        {this.state.product != '' ? (
          <FAB
            style={{
              backgroundColor: '#0F0B56',
              position: 'absolute',
              bottom: 80,
              right: 30,
            }}
            icon="plus"
            color="#fff"
            onPress={() => this.props.navigation.navigate('CreateItem', {id})}
          />
        ) : (
          <View style={{flex: 2}}>
            <View style={{alignSelf: 'center', bottom: 25}}>
              <Text style={{fontSize: 20, fontWeight: '600', color: 'grey'}}>
                No Item Found
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
                label="Add Item"
                color="#fff"
                onPress={() =>
                  this.props.navigation.navigate('CreateItem', {id})
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
  headertext: {
    color: '#555555',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 27,
  },
  detailtext: {
    color: '#ACACAC',
    fontSize: 15,
    fontWeight: 'normal',
    lineHeight: 22,
    top: 4,
    left: 5,
  },
});

const mapStateToProps = (state, ownProps) => ({
  // access or fetch
  biniData: state.authReducer.binidata,
  productData: state.authReducer.productdata,
  profileImage: state.authReducer.profileimage,
});
const mapDispatchToProps = {
  // to stored
};
export default connect(mapStateToProps, mapDispatchToProps)(ShowBinData);
