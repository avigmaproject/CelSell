import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const InputView = ({text, ...props}) => {
  return (
    <TouchableOpacity
      style={{
        width: '90%',
        alignSelf: 'center',
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6633FF',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
      }}
      onPress={props.onPress}>
      <Text
        style={{
          color: '#FFFFFF',
          fontWeight: '500',
          fontSize: 20,
          lineHeight: 30,
        }}>
        {text}
      </Text>
      <Image source={props.Image} />
    </TouchableOpacity>
  );
};
export default InputView;
