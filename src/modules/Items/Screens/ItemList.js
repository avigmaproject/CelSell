import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {FAB} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBackWithSearchBar from '../../../components/HeaderBackWithSearchBar';
import {getproducts} from '../../../services/api.function';

export const ItemList = ({navigation, route}) => {
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [initial, setInitial] = useState([]);
  const [name, setName] = useState('');
  const [bin, setBin] = useState('');
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      GetImage();
      getToken();
      console.log(route.params.data[0], 'route.params.name');
      const Bin = route.params.data[0].Bin_PkeyID;
      AsyncStorage.setItem('BinID', Bin.toString());
      setName(route.params.data[0].Bin_Name);
      setBin(Bin);
    });
    return unsubscribe;
  }, [navigation]);

  const GetImage = async () => {
    setPhoto(await AsyncStorage.getItem('imagepath'));
  };

  const GetProducts = async token => {
    setLoading(true);
    var data = JSON.stringify({
      Pro_PkeyID: 1,
      Pro_Bin_PkeyID: route.params.data[0].Bin_PkeyID,
      User_PkeyID: 1,
      Type: 3,
    });
    try {
      const res = await getproducts(data, token);
      console.log(res, 'redsssssssssss');
      setData(res[0]);
      setInitial(res[0]);
      setLoading(false);
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      setLoading(false);
    }
  };

  const getToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('token');
      if (token) {
        GetProducts(token);
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const searchText = e => {
    let text = e.toLowerCase();
    let bins = data;
    let filteredName = bins.filter(item => {
      return item.Pro_Name.toLowerCase().match(text);
    });
    if (!text || text === '') {
      setData(initial);
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      setNoData(true);
    } else if (Array.isArray(filteredName)) {
      setNoData(false);
      setData(filteredName);
    }
  };

  const renderdata = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ItemDetails', {item})}>
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
                uri: item.ProImage_ImagePath,
              }}
            />
            <View style={{paddingHorizontal: 40, paddingVertical: 5}}>
              <Text
                style={{
                  color: '#0F0B56',
                  fontSize: 16,
                  lineHeight: 24,
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
                  width: '25%',
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
            onPress={() => navigation.navigate('EditItem', {item})}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
      <Spinner visible={loading} />
      <HeaderBackWithSearchBar
        text1={name}
        // text1="Items"
        onPress={() => navigation.goBack()}
        onimageclick={() => navigation.navigate('MyProfile')}
        image={
          photo
            ? photo
            : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
        }
        onChangeText={searchText}
      />

      <FlatList
        data={data}
        renderItem={renderdata}
        style={{marginTop: 5, marginBottom: 10}}
      />
      {data != '' ? (
        <FAB
          style={{
            backgroundColor: '#0F0B56',
            position: 'absolute',
            bottom: 80,
            right: 30,
          }}
          icon="plus"
          color="#fff"
          onPress={() => navigation.navigate('CreateItem', {bin})}
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
              onPress={() => navigation.navigate('CreateItem', {bin})}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ItemList;
