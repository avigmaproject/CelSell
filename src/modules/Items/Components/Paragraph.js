import React from 'react';
import {TextInput} from 'react-native-paper';

const Paragraph = ({label, text, onChangeText, ...props}) => {
  return (
    <TextInput
      label={label}
      value={text}
      onChangeText={onChangeText}
      multiline={true}
      mode="outlined"
      outlineColor="transparent"
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
          primary: '#ACACAC',
          underlineColor: 'transparent',
          background: '#FFFFFF',
        },
      }}
    />
  );
};

export default Paragraph;
