import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Dimensions,
  AppState,
} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';

const {width, height} = Dimensions.get('window');
const delay = 5;

export default class SplashScreen extends Component {
  // useEffect(() => {
  //   let timer1 = setTimeout(() => navigation.navigate('Login'), 1000);
  //   return () => {
  //     clearTimeout(timer1);
  //   };
  // }, []);
  constructor(props) {
    super(props);
    this.state = {
      appState: 'active',
    };
  }

  _getInitialUrl = async () => {
    const url = dynamicLinks().onLink(this.handleDynamicLink);
    this.setState({
      linkdata: url,
    });
  };
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this._getInitialUrl();
    }
  };
  handleDynamicLink = link => {
    if (link.url.includes('CreateUpdateBinMaster')) {
      alert('hii');
      this.props.navigation.navigate('ShowBinData', {link: link.url});
    } else {
      this.props.navigation.navigate('ResetPassword', {link: link.url});
    }
  };

  substring = () => {
    console.log(this.state.linkdata, 'substring');
  };
  componentDidMount = async () => {
    setTimeout(() => {
      this.props.navigation.navigate('Login');
    }, 5000);
    this._getInitialUrl();
    this.substring();
    AppState.addEventListener('change', this._handleAppStateChange);
    await dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link) {
          console.log('Loginlink', link);
          this.props.navigation.navigate('ResetPassword', {link: link.url});
        }
        console.log('Loginlinklink', link);
      });
  };

  render() {
    return (
      <SafeAreaView>
        <Animated.Image
          source={require('../../assets/Image/Logo.png')}
          style={{
            width: '90%',
            height: '100%',
            resizeMode: 'contain',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        />
        <Animated.View
          style={{
            width: width,
            height,
            position: 'absolute',
            zIndex: -1,
          }}
        />
      </SafeAreaView>
    );
  }
}
