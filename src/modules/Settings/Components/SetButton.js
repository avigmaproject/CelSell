import * as React from 'react';
import {Button as PaperButton} from 'react-native-paper';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const SetButton = ({text, ...props}) => {
  return (
    <TouchableOpacity
      style={{
        width: '90%',
        alignSelf: 'center',
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#A792FF',
        borderRadius: 8,
        shadowColor: 'grey',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowOffset: {
          height: 2,
          width: 2,
        },
      }}
      onPress={props.onPress}>
      <Text
        style={{
          color: '#000000',
          fontWeight: '500',
          fontSize: 16,
          lineHeight: 24,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default SetButton;
