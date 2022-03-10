import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HiddenItemWithActions = ({
  swipeAnimatedValue,
  leftActionActivated,
  rightActionActivated,
  rowActionAnimatedValue,
  rowHeightAnimatedValue,
  onClose,
  onDelete,
  onCameraPress,
  ...props
}) => {
  if (rowActionAnimatedValue) {
    Animated.spring(rowActionAnimatedValue, {
      toValue: 500,
      useNativeDriver: false,
    }).start();
  } else {
    Animated.spring(rowActionAnimatedValue, {
      toValue: 75,
      useNativeDriver: false,
    }).start();
  }
  if (leftActionActivated) {
    Animated.spring(rowActionAnimatedValue, {
      toValue: 500,
      useNativeDriver: false,
    }).start();
  } else {
    Animated.spring(rowActionAnimatedValue, {
      toValue: 75,
      useNativeDriver: false,
    }).start();
  }

  return (
    <Animated.View style={[styles.rowBack, {height: rowHeightAnimatedValue}]}>
      {!rightActionActivated && (
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backLeftBtnLeft]}
          onPress={onClose}>
          <AntDesign
            name="closecircleo"
            size={25}
            style={styles.trash}
            color="#fff"
          />
        </TouchableOpacity>
      )}
      {!rightActionActivated && (
        <Animated.View
          style={[
            styles.backLeftBtn,
            styles.backLeftBtnRight,
            {
              flex: 1,
              width: rowActionAnimatedValue,
            },
          ]}>
          <TouchableOpacity
            style={[styles.backLeftBtn, styles.backLeftBtnRight]}
            onPress={onDelete}>
            <Animated.View
              style={[
                styles.trash,
                {
                  transform: [
                    {
                      scale: swipeAnimatedValue.interpolate({
                        inputRange: [45, 90],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}>
              <Feather
                name="trash"
                size={25}
                color="#fff"
                // style={styles.trash}
              />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {!leftActionActivated && (
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={onClose}>
          <AntDesign
            name="closecircleo"
            size={25}
            style={styles.trash}
            color="#fff"
          />
        </TouchableOpacity>
      )}
      {!leftActionActivated && (
        <Animated.View
          style={[
            styles.backRightBtn,
            styles.backRightBtnRight,
            {
              flex: 1,
              width: rowActionAnimatedValue,
            },
          ]}>
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnRight]}
            onPress={onCameraPress}>
            <Animated.View
              style={[
                styles.trash,
                {
                  transform: [
                    {
                      scale: swipeAnimatedValue.interpolate({
                        inputRange: [-90, -45],
                        outputRange: [1, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
              ]}>
              <Feather
                name="camera"
                size={25}
                color="#fff"
                // style={styles.trash}
              />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default HiddenItemWithActions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    // flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
    width: '100%',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginTop: 20,
  },
  backRightBtn: {
    alignItems: 'center',
    // bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    // top: 0,
    width: 80,
    // paddingRight: 17,
    height: 105,
  },
  backRightBtnLeft: {
    backgroundColor: '#A792FF',
    right: 80,
  },
  backRightBtnRight: {
    backgroundColor: 'grey',
    right: 0,
  },
  backLeftBtnRight: {
    backgroundColor: 'red',
    left: 0,
  },
  backLeftBtnLeft: {
    backgroundColor: '#A792FF',
    left: 75,
  },
  backLeftBtn: {
    alignItems: 'center',
    // bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    // top: 0,
    width: 80,
    // paddingRight: 17,
    height: 105,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
});
