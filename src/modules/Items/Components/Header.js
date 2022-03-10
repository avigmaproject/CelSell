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
  TextInput,
} from 'react-native';

const Header = ({header, onPressCancel, onPressSave, ...props}) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        height: 100,
        justifyContent: 'center',
        paddingHorizontal: 15,
      }}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 20,
          // justifyContent: 'space-between',
          //   alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={onPressCancel}
          style={{
            backgroundColor: '#F3F2F4',
            height: 35,
            width: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#ACACAC',
              fontSize: 14,
              lineHeight: 21,
              fontWeight: '500',
            }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <View style={{marginLeft: 75}}>
          <Text
            style={{
              color: '#0F0B56',
              fontSize: 24,
              lineHeight: 36,
              fontWeight: '600',
            }}>
            {header}
          </Text>
        </View>

        {/* <TouchableOpacity
          onPress={onPressSave}
          style={{
            backgroundColor: '#E5DFF5',
            height: 35,
            width: 60,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#6633FF',
              fontSize: 14,
              lineHeight: 21,
              fontWeight: '500',
            }}>
            Save
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Header;
