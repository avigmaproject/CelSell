import React from 'react';
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
import {useToast} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {getprofiles} from '../../../../services/api.function';
import HeaderBack from '../../../../components/HeaderBack';
import InputText from '../../Components/InputText';
import {FAB} from 'react-native-paper';
import Button from '../../../../components/Button';

const Profiles = ({navigation}) => {
  const [data, setData] = React.useState([]);
  const [id, setId] = React.useState(null);
  const [photo, setPhoto] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const toast = useToast();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      GetImage();
      getToken();
    });
    return unsubscribe;
  }, [navigation]);

  const GetImage = async () => {
    setPhoto(await AsyncStorage.getItem('imagepath'));
  };

  const GetProfile = async token => {
    setLoading(true);
    var data = JSON.stringify({
      Type: 3,
    });
    try {
      const res = await getprofiles(data, token);
      setData(res[0]);
      setLoading(false);
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
      let message = '';
      if (error.response) {
        setLoading(false);
      } else {
        message = '';
      }
      console.log({message});
    }
  };

  const getToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('token');
      if (token) {
        GetProfile(token);
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const renderdata = ({item}) => {
    return (
      <View
        style={{
          marginTop: 15,
          height: 75,
          justifyContent: 'center',
          backgroundColor:
            item.User_IsActive_Prof === true ? '#BDBDBD' : '#FFF',
          borderRadius: 6,
          shadowColor: 'grey',
          shadowOpacity: 0.8,
          shadowRadius: 2,
          shadowOffset: {
            height: 2,
            width: 2,
          },
        }}>
        {/* {item.User_IsActive_Prof === true ? (
          <BouncyCheckbox
            size={15}
            fillColor="#00FF00"
            // text="Custom Checkbox"
            isChecked={item.User_IsActive_Prof === true ? 'true' : 'false'}
            style={{position: 'absolute', left: 10, justifyContent: 'center'}}
          />
        ) : null} */}
        <View style={{flexDirection: 'row'}}>
          <Image
            style={{
              height: 75,
              width: 75,
              borderRadius: 1,
              borderColor: '#BDBDBD',
              borderWidth: 1,
            }}
            source={{
              uri: item.User_Image_Path
                ? item.User_Image_Path
                : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg',
            }}
          />

          <View style={{marginLeft: 15, justifyContent: 'center'}}>
            <Text style={{fontSize: 17, paddingHorizontal: 10, color: '#000'}}>
              {item.User_Name}
            </Text>
            <Text style={{fontSize: 12, paddingHorizontal: 10, color: '#000'}}>
              {item.User_Email}
            </Text>
          </View>

          <FAB
            style={{
              backgroundColor: '#A792FF',
              position: 'absolute',
              right: 20,
              top: 20,
              justifyContent: 'center',
            }}
            icon="pencil"
            color="#fff"
            small
            onPress={
              item.User_PkeyID_Master === 0
                ? () => navigation.navigate('MyProfile')
                : () => navigation.navigate('UpdateProfile', {item})
            }
          />
        </View>
      </View>
    );
  };

  const showMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      toast.show({
        title: message,
        placement: 'bottom',
        status: 'success',
        duration: 5000,
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
      <Spinner visible={loading} />
      <HeaderBack
        text="Profiles"
        onPress={() => navigation.goBack()}
        onimageclick={() => navigation.navigate('MyProfile')}
        image={
          photo
            ? photo
            : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
        }
      />
      <FlatList
        data={data}
        renderItem={renderdata}
        style={{marginTop: 20, marginBottom: 20, paddingHorizontal: 25}}
      />
      {data != '' ? (
        <FAB
          style={{
            backgroundColor: '#0F0B56',
            bottom: 80,
            position: 'absolute',
            right: 30,
          }}
          icon="plus"
          color="#fff"
          onPress={() => navigation.navigate('AddProfile')}
        />
      ) : (
        <View style={{flex: 2}}>
          <View style={{alignSelf: 'center', bottom: 25}}>
            <Text style={{fontSize: 20, fontWeight: '600', color: 'grey'}}>
              No Profile Found
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
              label="Add Profile"
              color="#fff"
              onPress={() => navigation.navigate('AddProfile')}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Profiles;
