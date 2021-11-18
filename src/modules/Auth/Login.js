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
import {login} from '../../services/api.function';
import {useDispatch} from 'react-redux';
import {setToken} from '../../store/action/auth/action';
const Login = ({navigation}) => {
  const dispatch = useDispatch();

  const [email, setEmail] = React.useState('');

  const [password, setPassword] = React.useState('');
  const [loading, setloading] = React.useState(false);
  const [data, setData] = React.useState({
    secureTextEntry: true,
  });
  const toast = useToast();

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const Validation = () => {
    let cancel = false;
    if (email.length === 0) {
      cancel = true;
    }
    if (password.length === 0) {
      cancel = true;
    }
    if (cancel) {
      showerrorMessage('Fields can not be empty');
      return false;
    } else {
      return true;
    }
  };

  const LoginUser = async () => {
    if (Validation()) {
      setloading(true);
      let data = qs.stringify({
        username: email,
        password: password,
        clientid: 1,
        grant_type: 'password',
        // ip: '2409:4042:802:91fa:44b9:d3c2:9204:c4e9',
        // macid: '2409:4042:802:91fa:44b9:d3c2:9204:c4e9',
        // User_Login_Type: 1,
      });
      console.log(data);
      await login(data)
        .then(res => {
          showMessage('Login successfully');
          console.log('res: ', res);
          setloading(false);
          dispatch(setToken(res.access_token));
          AsyncStorage.setItem('token', res.access_token);
          // navigation.navigate('DrawerNavigator', {screen: 'HomeScreen'});
        })
        .catch(error => {
          setloading(false);
          if (
            error.response.data.error_description ===
            'The UserCode or password is incorrect.'
          ) {
            showerrorMessage('username or password is incorrect');
          } else {
            showerrorMessage(error.response.data.error_description);
          }
        });
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
      <Spinner visible={loading} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            // height: '50%',
            marginTop: '40%',
            marginBottom: '15%',
            // borderWidth: 1,
          }}>
          <Text
            style={{
              color: '#0F0B56',
              fontWeight: '600',
              fontSize: 24,
              lineHeight: 36,
            }}>
            Login Now
          </Text>
        </View>
        <View>
          <InputText
            label="Email / Username"
            onChangeText={email => setEmail(email)}
            value={email}
            placeholder="Enter your Emal ID / Username"
          />
        </View>
        <View style={{marginTop: 10}}>
          <InputText
            label="Password"
            onChangeText={password => setPassword(password)}
            value={password}
            placeholder="Enter Your Password"
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
        <View
          style={{
            marginTop: 10,
            width: '32%',
            // borderWidth: 1,
            alignSelf: 'center',
            left: 110,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text
              style={{
                color: '#6633FF',
                fontWeight: '700',
                fontSize: 14,
                lineHeight: 21,
                textDecorationLine: 'underline',
              }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 35}}>
          <Button text="Login" onPress={LoginUser} backgroundColor="#6633FF" />
        </View>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              color: '#969696',
              fontWeight: '600',
              fontSize: 14,
              lineHeight: 21,
            }}>
            Don't have an account? {''}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text
              style={{
                color: '#6633FF',
                fontWeight: '600',
                fontSize: 14,
                lineHeight: 21,
              }}>
              Sign up Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
