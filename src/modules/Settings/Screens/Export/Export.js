import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import HeaderBack from '../../../../components/HeaderBack';
import InputView from '../../Components/InputView';
import DropDownPicker from 'react-native-dropdown-picker';

const Export = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F3F2F4'}}>
      <View>
        <HeaderBack
          text="Export"
          onPress={() => navigation.goBack()}
          onimageclick={() => navigation.navigate('MyProfile')}
        />
      </View>
      <View style={{marginTop: 30}}>
        <Image
          source={require('../../../../assets/Image/Export.png')}
          style={{
            width: '45%',
            height: '50%',
            resizeMode: 'contain',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        />
      </View>
      <View style={{marginTop: -80}}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select bin"
          style={{
            height: 65,
            borderWidth: 0,
          }}
          containerStyle={{
            width: '90%',
            alignSelf: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
          labelStyle={{
            fontWeight: 'bold',
            color: '#00f',
            fontSize: 16,
            lineHeight: 24,
          }}
        />
      </View>

      <View style={{marginTop: 50}}>
        <InputView
          text="EXPORT AS PDF"
          Image={require("'../../../../assets/Image/Pdf.png")}
        />
      </View>
      <View style={{marginTop: 20}}>
        <InputView
          text="EXPORT AS CSV"
          Image={require("'../../../../assets/Image/Csv.png")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Export;
