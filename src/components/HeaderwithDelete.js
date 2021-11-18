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
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FAB} from 'react-native-paper';

const HeaderwithDelete = ({text, image, onDelete, ...props}) => {
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
      <FAB
        style={{
          backgroundColor: 'red',
          position: 'absolute',
          right: 30,
          top: 20,
        }}
        small
        icon="delete"
        color="#fff"
        onPress={onDelete}
      />
    </View>
  );
};

export default HeaderwithDelete;
