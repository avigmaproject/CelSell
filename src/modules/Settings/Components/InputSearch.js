import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
} from 'react-native';

const InputSearch = ({
  placeholder,
  onChangeText,
  value,
  data,
  renderItem,
  keyExtractor,
  ...props
}) => {
  return (
    <View style={{marginTop: 10}}>
      <TextInput
        style={{
          height: 60,
          margin: 12,
          // borderWidth: 1,
          width: '90%',
          alignSelf: 'center',
          padding: 10,
          backgroundColor: '#FFFFFF',
          borderRadius: 6,
          color: '#000',
          padding: 20,
        }}
        onChangeText={onChangeText}
        autoCorrect={false}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="gray"
      />

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          backgroundColor: '#FFFFFF',
          width: '90%',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default InputSearch;
