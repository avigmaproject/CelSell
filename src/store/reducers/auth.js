export const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  registerMode: false,
  userid: null,
};

const reducer = (state = initialState, action) => {
  // console.log("actionaction", action);
  switch (action.type) {
    case 'SIGN_OUT': {
      return {
        ...state,
        isSignout: true,
        userToken: null,
      };
    }

    case 'SIGN_IN': {
      console.log('reduxxxxxxx', {action: action.token});
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
      };
    }
    case 'MODE': {
      return {
        ...state,
        registerMode: action.mode,
      };
    }
    case 'RESTORE_TOKEN': {
      console.log('im herererer');
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    }
    case 'SET_USERID': {
      return {
        ...state,
        userid: action.userid,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
