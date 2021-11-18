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
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../../../components/HeaderBack';

const QrCode = ({navigation, route}) => {
  const [photo, setPhoto] = React.useState('');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      GetImage();
    });
    return unsubscribe;
  }, [navigation]);

  const GetImage = async () => {
    const imagepath = await AsyncStorage.getItem('imagepath');
    setPhoto(imagepath);
    console.log(route.params.item.Bin_QR_Path, 'route.params.item.Bin_QR_Path');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
      <HeaderBack
        text={route.params.item.Bin_Name}
        onPress={() => navigation.goBack()}
        onimageclick={() => navigation.navigate('MyProfile')}
        image={
          photo
            ? photo
            : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
        }
      />
      <View style={{alignItems: 'center', marginTop: 25}}>
        <Text
          style={{
            color: '#555555',
            fontSize: 24,
            lineHeight: 30,
            fontWeight: '600',
            textAlign: 'center',
            width: '80%',
          }}>
          Scan this QR code to get bin details
        </Text>
      </View>
      <View style={{alignItems: 'center', marginTop: 25}}>
        <Image
          style={{
            height: 450,
            width: 350,
          }}
          source={{
            uri: route.params.item.Bin_QR_Path,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default QrCode;
