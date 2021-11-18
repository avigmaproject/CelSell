import React, {useEffect, useState} from 'react';
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

import AntDesign from 'react-native-vector-icons/AntDesign';

const HeaderBack = ({text, image, onimageclick, ...props}) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <TouchableOpacity
        onPress={props.onPress}
        style={{position: 'absolute', left: 20}}>
        <AntDesign name="arrowleft" size={30} color="#0F0B56" />
      </TouchableOpacity>
      <Text
        style={{
          color: '#0F0B56',
          fontSize: 24,
          lineHeight: 36,
          fontWeight: '700',
        }}>
        {text}
      </Text>
    </View>
  );
};

export default HeaderBack;
