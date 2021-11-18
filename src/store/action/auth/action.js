export const setToken = token => {
  console.log('tokenAction', token);
  return dispatch => {
    dispatch({type: 'SIGN_IN', token: token});
  };
};

export const signOut = () => {
  return dispatch => {
    dispatch({type: 'SIGN_OUT'});
  };
};
export const registerMode = mode => {
  return dispatch => {
    dispatch({type: 'MODE', mode});
  };
};

export const restoreToken = token => {
  return dispatch => {
    dispatch({type: 'RESTORE_TOKEN', token: token});
  };
};

export const userId = userid => {
  return dispatch => {
    dispatch({type: 'SET_USERID', userid: userid});
  };
};
