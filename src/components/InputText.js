import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TextInput} from 'react-native-paper';

const InputText = props => {
  return (
    <TextInput
      label={props.label}
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
      secureTextEntry={props.secureTextEntry}
      keyboardType={props.keyboardType}
      onSubmitEditing={props.onSubmitEditing}
      onBlur={props.onBlur}
      mode="outlined"
      outlineColor="transparent"
      // dense
      style={{
        width: '90%',
        alignSelf: 'center',
        // height: 65,
        fontSize: 14,
        color: '#000000',
      }}
      theme={{
        colors: {
          placeholder: '#ACACAC',
          text: '#000',
          primary: '#0F0B56',
          underlineColor: 'transparent',
          background: '#FFFFFF',
        },
      }}
    />
  );
};

export default InputText;
