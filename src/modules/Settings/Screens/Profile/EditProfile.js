import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Select, useToast} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputText from '../../../../components/InputText';
import Button from '../../../../components/Button';
import BackButton from '../../../../components/BackButton';
import {
  userprofile,
  updateuserprofile,
} from '../../../../services/api.function';

const EditProfile = ({navigation}) => {
  const [data, setData] = React.useState({
    loading: false,
    secureTextEntry: true,
  });
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState(null);
  const [gender, setGender] = React.useState('');
  const [userid, setUserid] = React.useState('');
  const [imagepath, setImagepath] = React.useState('');
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getToken();
    });
    return unsubscribe;
  }, [navigation]);

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const onSubmit = () => {
    navigation.navigate('MyProfile');
  };

  const getUserData = async token => {
    setData({loading: true});
    var data = JSON.stringify({
      // User_PkeyId: 1,
      User_PkeyID_Master: 0,
      Type: 2,
    });
    try {
      const res = await userprofile(data, token);
      console.log(res, 'ressssssss');
      console.log(res[0][0].User_Email, ' res[0][0].User_Name');
      setName(res[0][0].User_Name);
      setEmail(res[0][0].User_Email);
      setPhone(res[0][0].User_Phone);
      setPassword(res[0][0].User_Password);
      setUserid(res[0][0].User_PkeyID);
      setImagepath(res[0][0].User_Image_Path);
      setData({
        loading: false,
      });
    } catch (error) {
      console.log('hihihihihihih', {e: error.response.data.error});
    }
  };

  const Validation = () => {
    let cancel = false;
    if (name.length === 0) {
      cancel = true;
    }
    if (phone.length === 0) {
      cancel = true;
    }
    if (cancel) {
      showerrorMessage('Fields can not be empty');
      return false;
    } else {
      return true;
    }
  };

  const PhoneValidation = () => {
    let cancel = false;
    if (phone.length > 10 || phone.length < 10) {
      cancel = true;
    }
    if (cancel) {
      showerrorMessage('Invalid Phone Number');
      return false;
    } else {
      return true;
    }
  };

  const updateUserData = async () => {
    if (Validation() && PhoneValidation()) {
      setData({loading: true});
      let data = {
        User_PkeyID: userid,
        User_Email: email,
        User_Name: name,
        User_Phone: phone,
        User_Gender: gender,
        User_Image_Path: imagepath,
        User_Password: password,
        Type: 2,
        User_Type: 1,
        User_IsActive: 1,
        User_IsDelete: 0,
      };
      console.log(data, 'userrrrr');
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await updateuserprofile(data, token);
        console.log('ressssss:', res);
        showMessage('Profile Updated');
        navigation.navigate('MyProfile');
      } catch (error) {
        showerrorMessage(error.response.data.error_description);
      }
    }
  };

  const getToken = async () => {
    let token;
    try {
      token = await AsyncStorage.getItem('token');
      if (token) {
        getUserData(token);
      } else {
        console.log('no token found');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const showerrorMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      toast.show({
        title: message,
        placement: 'bottom',
        status: 'error',
        duration: 5000,
        // backgroundColor: 'red.500',
      });
    }
  };

  const showMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      toast.show({
        title: message,
        placement: 'bottom',
        status: 'success',
        duration: 5000,
        // backgroundColor: 'red.500',
      });
    }
  };

  const warningMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      toast.show({
        title: message,
        placement: 'bottom',
        status: 'warning',
        duration: 5000,
        // backgroundColor: 'red.500',
      });
    }
  };

  return (
    <SafeAreaView>
      <Spinner visible={data.loading} />
      <BackButton
        text="Edit Your Profile"
        onPress={() => navigation.goBack()}
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{marginTop: 50}}>
          <InputText
            label="Full Name"
            value={name}
            onChangeText={name => setName(name)}
          />
        </View>
        <View style={{marginTop: 20}}>
          <InputText
            label="Phone no."
            value={phone}
            keyboardType="numeric"
            onChangeText={phone => setPhone(phone)}
          />
        </View>
        <View style={{marginTop: 20}}>
          <InputText
            label="Email Address"
            value={email}
            // onChangeText={email => setData({email})}
          />
        </View>
        <View style={{marginTop: 20}}>
          <InputText
            label="Password"
            value={password}
            onChangeText={password => setPassword(password)}
            secureTextEntry={data.secureTextEntry ? true : false}
          />
          <TouchableOpacity
            onPress={updateSecureTextEntry}
            style={{
              position: 'absolute',
              right: 30,
              top: 20,
              zIndex: 1,
            }}>
            <Icon
              name={data.secureTextEntry ? 'eye-with-line' : 'eye'}
              size={30}
              color="#ACACAC"
            />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20, alignItems: 'center'}}>
          <Select
            _selectedItem={{
              bg: '#ACACAC',
            }}
            mt={1}
            style={{
              justifyContent: 'center',
              height: 65,
              fontSize: 14,
              color: '#000000',
              backgroundColor: '#fff',
            }}
            mode="dropdown"
            width="90%"
            placeholder="Select Gender"
            // selectedValue={gender}
            onValueChange={itemValue => setGender(itemValue)}>
            <Select.Item label="Female" value={1} />
            <Select.Item label="Male" value={2} />
            <Select.Item label="Other" value={3} />
          </Select>
        </View>
        <View style={{marginTop: 50, marginBottom: 50}}>
          <Button
            text="Update"
            onPress={updateUserData}
            backgroundColor="#6633FF"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
