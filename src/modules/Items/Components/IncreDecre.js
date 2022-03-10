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
  Button,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const IncreDecre = ({onPressIncre, onPressDecre, value, ...props}) => {
  return (
    <View
      style={{
        marginTop: 30,
        paddingLeft: 25,
        flexDirection: 'row',
      }}>
      <View style={{justifyContent: 'center'}}>
        <Text
          style={{
            color: '#555555',
            fontSize: 18,
            fontWeight: '500',
            lineHeight: 27,
          }}>
          Quantity
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 15,
        }}>
        <TouchableOpacity
          onPress={onPressDecre}
          style={{
            backgroundColor: '#FFFFFF',
            height: 75,
            width: 75,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E4E4E4',
          }}>
          <Feather name="minus" size={30} color="#ACACAC" />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            height: 75,
            width: 90,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E4E4E4',
          }}>
          <Text
            style={{
              color: '#0F0B56',
              fontSize: 18,
              fontWeight: '500',
              lineHeight: 27,
            }}>
            {value}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onPressIncre}
          style={{
            backgroundColor: '#FFFFFF',
            height: 75,
            width: 75,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E4E4E4',
          }}>
          <Feather name="plus" size={30} color="#ACACAC" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IncreDecre;
