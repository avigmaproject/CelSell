import 'react-native-gesture-handler';

import * as React from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {connect} from 'react-redux';
import store, {persistor} from './src/store';
import {NavigationContainer} from '@react-navigation/native';
import {
  StackNavigation,
  AuthNavigation,
} from './src/navigation/Stack/MainStack';
import {DrawerNavigator} from './src/navigation/Drawer/DrawerStack';
import {AuthContext} from './src/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeBaseProvider} from 'native-base';

// export default function App({navigation}) {
//   const [state, dispatch] = React.useReducer(
//     (prevState, action) => {
//       switch (action.type) {
//         case 'RESTORE_TOKEN':
//           return {
//             ...prevState,
//             userToken: action.token,
//             isLoading: false,
//           };
//         case 'SIGN_IN':
//           return {
//             ...prevState,
//             isSignout: false,
//             userToken: action.token,
//           };
//         case 'SIGN_OUT':
//           return {
//             ...prevState,
//             isSignout: true,
//             userToken: null,
//           };
//       }
//     },
//     {
//       isLoading: true,
//       isSignout: false,
//       userToken: null,
//     },
//   );

//   React.useEffect(() => {
//     const bootstrapAsync = async () => {
//       let userToken;
//       try {
//         userToken = await AsyncStorage.getItem('token');
//       } catch (e) {}
//       dispatch({type: 'RESTORE_TOKEN', token: userToken});
//     };
//     bootstrapAsync();
//   }, []);

//   const authContext = React.useMemo(
//     () => ({
//       setToken: async token => {
//         dispatch({type: 'SIGN_IN', token: token});
//       },
//       signOut: () => dispatch({type: 'SIGN_OUT'}),
//     }),
//     [],
//   );

const App = () => {
  const userToken = useSelector(state => state.authReducer.userToken);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {userToken ? <StackNavigation /> : <AuthNavigation />}
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

const AppWrapper = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
export default AppWrapper;
