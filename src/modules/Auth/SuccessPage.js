import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import Button from '../../components/Button';

export const SuccessPage = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
      <View style={{alignSelf: 'center', marginTop: 100}}>
        <Text
          style={{
            color: '#000000',
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '800',
          }}>
          Your password has been changed successfully!!
        </Text>
      </View>
      <View style={{marginTop: 30}}>
        <Button
          text="Click here for login"
          backgroundColor="#6633FF"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </SafeAreaView>
  );
};
export default SuccessPage;
