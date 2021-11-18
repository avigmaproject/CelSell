import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import qs from 'qs';
import Spinner from 'react-native-loading-spinner-overlay';
import {useToast} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputText from '../../components/InputText';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/Entypo';
import {register} from '../../services/api.function';
import {
  verifyEmail,
  verifyPassword,
} from './miscellaneous/miscellaneous.configure';
import {useDispatch} from 'react-redux';
import {setToken} from '../../store/action/auth/action';

const Register = ({navigation}) => {
  const dispatch = useDispatch();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmpassword, setConfirmpassword] = React.useState('');
  const [loading, setloading] = React.useState(false);
  const [data, setData] = React.useState({
    secureTextEntry: true,
    secureTextEntryForConfirmPass: true,
  });
  const toast = useToast();

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const updateSecureTextEntryForConfirmPass = () => {
    setData({
      ...data,
      secureTextEntryForConfirmPass: !data.secureTextEntryForConfirmPass,
    });
  };

  const Validation = () => {
    let cancel = false;
    if (name.length === 0) {
      cancel = true;
    }
    if (email.length === 0) {
      cancel = true;
    }
    if (password.length === 0) {
      cancel = true;
    }
    if (confirmpassword.length === 0) {
      cancel = true;
    }
    if (cancel) {
      showerrorMessage('Fields can not be empty');
      return false;
    } else {
      return true;
    }
  };

  const RegisterUser = async () => {
    if (
      Validation() &&
      passwordCheck() &&
      checkPassEmail(email, confirmpassword)
    ) {
      setloading(true);

      let data = qs.stringify({
        firstname: name,
        username: email,
        password: confirmpassword,
        clientid: 2,
        grant_type: 'password',
        // ip: '2409:4042:802:91fa:44b9:d3c2:9204:c4e9',
        // macid: '2409:4042:802:91fa:44b9:d3c2:9204:c4e9',
        // User_Login_Type: 1,
      });
      console.log(data);
      await register(data)
        .then(res => {
          showMessage('Account created successfully');
          console.log('res: ', res);
          setloading(false);
          dispatch(setToken(res.access_token));
          AsyncStorage.setItem('token', res.access_token);
          navigation.navigate('DrawerNavigator', {screen: 'HomeScreen'});
        })
        .catch(error => {
          setloading(false);
          showerrorMessage(error.response.data.error_description);
        });
    }
  };

  const checkPassEmail = (email, password) => {
    let cancel = false;
    if (verifyEmail(email)) {
      cancel = true;
      warningMessage('Please enter valid email');
    }
    if (verifyPassword(password)) {
      cancel = true;
      warningMessage(
        `Your password must be minimum 8 characters to 16 characters and must contain one uppercase, one digit and special character '?!@#$%^&*'`,
      );
    }
    if (cancel) {
      return false;
    } else {
      return true;
    }
  };

  const passwordCheck = () => {
    if (password !== confirmpassword) {
      warningMessage('Password does not match');
      return false;
    } else {
      return true;
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F3F2F4',
      }}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Spinner visible={loading} />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            // height: '50%',
            marginTop: '30%',
            marginBottom: '10%',
            // borderWidth: 1,
          }}>
          <Text
            style={{
              color: '#0F0B56',
              fontWeight: '600',
              fontSize: 24,
              lineHeight: 36,
            }}>
            Sign up Now
          </Text>
        </View>
        <View>
          <InputText
            label="Name"
            placeholder="Enter your Name"
            value={name}
            onChangeText={name => setName(name)}
          />
        </View>
        <View style={{marginTop: 10}}>
          <InputText
            label="Email / Username"
            placeholder="Enter your Emal ID / Username"
            value={email}
            onChangeText={email => setEmail(email)}
          />
        </View>
        <View style={{marginTop: 10}}>
          <InputText
            label="Password"
            placeholder="Enter Your Password"
            secureTextEntry={data.secureTextEntry ? true : false}
            value={password}
            onChangeText={password => setPassword(password)}
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
        <View style={{marginTop: 10}}>
          <InputText
            label="Confirm Password"
            placeholder="Confirm Your Password"
            secureTextEntry={data.secureTextEntryForConfirmPass ? true : false}
            value={confirmpassword}
            onChangeText={confirmpassword =>
              setConfirmpassword(confirmpassword)
            }
          />
          <TouchableOpacity
            onPress={updateSecureTextEntryForConfirmPass}
            style={{
              position: 'absolute',
              right: 30,
              top: 20,
              zIndex: 1,
            }}>
            <Icon
              name={
                data.secureTextEntryForConfirmPass ? 'eye-with-line' : 'eye'
              }
              size={30}
              color="#ACACAC"
            />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 35}}>
          <Button
            text="Sign Up"
            onPress={() => RegisterUser()}
            backgroundColor="#6633FF"
          />
        </View>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 20,
          }}>
          <Text
            style={{
              color: '#969696',
              fontWeight: '600',
              fontSize: 14,
              lineHeight: 21,
            }}>
            If you already have an account {''}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                color: '#6633FF',
                fontWeight: '600',
                fontSize: 14,
                lineHeight: 21,
              }}>
              Login Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
