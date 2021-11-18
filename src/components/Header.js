import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {Select} from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

const Header = ({
  text1,
  text,
  image,
  onimageclick,
  selectedValue,
  onValueChange,
  label,
  value,
  ...props
}) => {
  return (
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
          onPress={props.onPress}
          style={{position: 'absolute', left: 20}}>
          <Entypo name="menu" size={30} color="#0F0B56" />
        </TouchableOpacity>
        <Text
          style={{
            color: '#0F0B56',
            fontSize: 24,
            lineHeight: 36,
            fontWeight: '700',
          }}>
          {text1}
        </Text>
        <Text
          style={{
            color: '#0F0B56',
            fontSize: 24,
            lineHeight: 36,
            fontWeight: '700',
          }}>
          {text}
        </Text>

        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 25,
            //   borderColor:"#FFFFFF"
          }}
          onPress={onimageclick}>
          <Image
            style={{
              height: 45,
              width: 45,
              borderRadius: 45,
              borderColor: '#BDBDBD',
              borderWidth: 1,
            }}
            source={{
              uri: image,
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 10}}>
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
          onChangeText={props.onChangeText}
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
  );
};

export default Header;
