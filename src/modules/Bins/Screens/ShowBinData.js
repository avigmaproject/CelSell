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
} from 'react-native';
import {getbins} from '../../../services/api.function';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../../../components/HeaderBack';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../../../components/Button';

export default class ShowBinData extends Component {
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
    };
  }
  componentDidMount() {
    console.log('showbin', this.props.route.params.link);
    const {link} = this.props.route.params;
    if (link) {
      const spliturl = link.split('/');
      console.log('spliturl', spliturl[4]);
      this.setState({id: spliturl[4]});
    } else {
      this.setState({id: this.props.route.params.item.Bin_PkeyID});
    }

    this.getToken();
    this.GetImage();
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
      console.log(res, 'red');
      this.setState({
        data: res[0],
        imagepath: res[0][0].Bin_Image_Path,
        name: res[0][0].Bin_Name,
        location: res[0][0].Loc_Name,
        unit: res[0][0].Bin_Unit,
        shelf: res[0][0].Bin_Shelf,
        binid: res[0][0].Bin_PkeyID,
        loading: false,
      });
    } catch (error) {
      this.setState({loading: false});
      console.log('hihihihihihih', {e: error.response.data.error});
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
          width: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Feather name="database" size={20} color="#6633FF" />
        <Text
          style={{
            color: '#6633FF',
            fontSize: 14,
            lineHeight: 21,
            fontWeight: '500',
            paddingLeft: 5,
          }}>
          Items
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
        <HeaderBack
          text="Bin Details"
          onPress={() => this.props.navigation.goBack()}
          onimageclick={() => this.props.navigation.navigate('MyProfile')}
          image={
            this.state.photo
              ? this.state.photo
              : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
          }
        />
        <View
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
        </View>
        <Image
          style={{
            height: '40%',
            width: '90%',
            borderRadius: 2,
            marginTop: 20,
            alignSelf: 'center',
          }}
          source={{
            uri: this.state.imagepath ? this.state.imagepath : null,
          }}
        />
        <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
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
        <View style={{flexDirection: 'row', marginTop: 20, left: 20}}>
          <Text style={styles.headertext}>Unit :</Text>
          <Text style={styles.detailtext}>{this.state.unit}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            left: 20,
          }}>
          <Text style={styles.headertext}>Shelf :</Text>
          <Text style={styles.detailtext}>{this.state.shelf}</Text>
        </View>
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
