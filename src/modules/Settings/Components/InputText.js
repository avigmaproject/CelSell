import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';

const InputText = ({placeholder, header, ...props}) => {
  return (
    <View style={{}}>
      <Text
        style={{
          color: '#ACACAC',
          fontWeight: '500',
          fontSize: 16,
          lineHeight: 24,
          marginLeft: 20,
          marginBottom: 10,
        }}>
        {header}
      </Text>
      <TextInput
        style={{
          width: '90%',
          alignSelf: 'center',
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
          shadowColor: 'grey',
          shadowOpacity: 0.5,
          shadowRadius: 2,
          shadowOffset: {
            height: 1,
            width: 1,
          },
          color: '#0F0B56',
          fontSize: 16,
          lineHeight: 24,
          fontWeight: '500',
        }}
        onChangeText={props.onChangeText}
        value={props.value}
        placeholder={placeholder}
        placeholderTextColor="#0F0B56"
        placeholderStyle={{borderColor: 'red'}}
      />
    </View>
  );
};
export default InputText;
