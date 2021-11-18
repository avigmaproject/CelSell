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
} from 'react-native';

const InputView = ({text, value, ...props}) => {
  return (
    <View
      style={{
        width: '90%',
        alignSelf: 'center',
        height: 65,
        backgroundColor: '#FFF',
      }}>
      <Text
        style={{
          color: '#ACACAC',
          fontSize: 12,
          lineHeight: 18,
          top: 10,
          left: 10,
        }}>
        {text}
      </Text>
      <Text
        style={{
          color: '#0F0B56',
          fontSize: 16,
          lineHeight: 24,
          top: 15,
          left: 10,
        }}>
        {value}
      </Text>
    </View>
  );
};

export default InputView;
