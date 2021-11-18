import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Spinner from 'react-native-loading-spinner-overlay';
import Header from './components/Header';
import {Toast} from 'native-base';
import InputText from '../../components/InputText';
import Button from '../../components/Button';
import {forgotpassword} from '../../services/api.function';

export default class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      device: 1,
      isLoading: false,
    };
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.setState({
        device: 1,
      });
    } else {
      this.setState({
        device: 2,
      });
    }
  }
  generateLink = async () => {
    const link = await dynamicLinks().buildShortLink({
      link: `https://cellsell.page.link/forgetpassword/${this.state.email}`,
      domainUriPrefix: 'https://cellsell.page.link',
      // ios: {
      //   bundleId: "com.avigma.communv",
      //   appStoreId: "1579823021",
      //   fallbackUrl: "https://apps.apple.com/us/app/com.houseplant/id1535962213",
      // },
      android: {
        packageName: 'com.cellsell',
        fallbackUrl:
          'https://play.google.com/store/apps/details?id=com.cellsell',
      },
      navigation: {
        forcedRedirectEnabled: true,
      },
    });
    // console.log(link);
    this.setState({link});
  };
  onHandleForgotPassword = async () => {
    await this.generateLink();
    const error = this.Validation();
    if (error) {
      const {email, link, device} = this.state;
      this.setState({isLoading: true});
      console.log(email, 'email');
      console.log(link, 'link');
      if (email && link) {
        let data = {
          EmailID: email,
          Type: 1,
          Email_Url: link,
          Device: device,
        };
        console.log(data);
        await forgotpassword(data)
          .then(res => {
            console.log('res: ', JSON.stringify(res));
            console.log('res:123', res[0].UserCode);
            this.setState({isLoading: false});
            if (res[0].UserCode === 'Sucesss') {
              console.log('successs');
              this.showMessage(
                'Link sent successfully. Please check your registered email.',
              );
            }
            if (res[0].UserCode === 'Error') {
              this.showerrorMessage('Please check your email.');
            }
          })
          .catch(error => {
            if (error.response) {
              console.log('responce_error', error.response);
              this.setState({isLoading: false});
            } else if (error.request) {
              this.setState({isLoading: false});
              console.log('request error', error.request);
            }
          });
      } else {
        this.showerrorMessage('Something went wrong!!!');
      }
    }
  };

  Validation = () => {
    let cancel = false;
    if (this.state.email.length === 0) {
      cancel = true;
    }
    if (cancel) {
      this.showerrorMessage('Fields can not be empty');
      return false;
    } else {
      return true;
    }
  };

  showerrorMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      Toast.show({
        title: message,
        placement: 'bottom',
        status: 'error',
        duration: 5000,
        // backgroundColor: 'red.500',
      });
    }
  };

  showMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      Toast.show({
        title: message,
        placement: 'bottom',
        status: 'success',
        duration: 5000,
        // backgroundColor: 'red.500',
      });
    }
  };

  warningMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      Toast.show({
        title: message,
        placement: 'bottom',
        status: 'warning',
        duration: 5000,
        // backgroundColor: 'red.500',
      });
    }
  };

  render() {
    const {email} = this.state;
    return (
      <SafeAreaView>
        <Spinner visible={this.state.isLoading} />
        <Header
          text="Forgot Password"
          onPress={() => this.props.navigation.goBack()}
        />
        <View style={{marginTop: 30}}>
          <InputText
            label="Email Address"
            placeholder="Enter your Emal ID"
            onChangeText={email => this.setState({email})}
            value={email}
            onSubmitEditing={() => this.generateLink()}
            onBlur={() => this.generateLink()}
          />
        </View>

        <View style={{marginTop: 35}}>
          <Button
            text="Send Link"
            backgroundColor="#6633FF"
            onPress={() => this.onHandleForgotPassword()}
          />
        </View>
      </SafeAreaView>
    );
  }
}
