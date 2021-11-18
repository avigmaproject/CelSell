import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../../../components/HeaderBack';
import Button from '../../../components/Button';
import SetButton from '../Components/SetButton';

const Setting = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      GetEmail();
      GetImage();
    });
    return unsubscribe;
  }, [navigation]);

  const GetEmail = async () => {
    setEmail(await AsyncStorage.getItem('email'));
  };

  const GetImage = async () => {
    setPhoto(await AsyncStorage.getItem('imagepath'));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
      <HeaderBack
        text="Setting"
        onPress={() => navigation.goBack()}
        onimageclick={() => navigation.navigate('MyProfile')}
        image={
          photo
            ? photo
            : 'https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg'
        }
      />
      <ScrollView>
        <View style={{marginTop: 40}}>
          <SetButton
            text="My profiles"
            onPress={() => navigation.navigate('Profiles')}
          />
        </View>

        <View style={{marginTop: 20}}>
          <Button
            text="Move the items"
            backgroundColor="#6633FF"
            onPress={() => navigation.navigate('MoveItems')}
          />
        </View>
        <View style={{marginTop: 20, marginBottom: 20}}>
          <Button
            text="Transfer the bins to others"
            backgroundColor="#0D0C33"
            onPress={() => navigation.navigate('TransferBin')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
