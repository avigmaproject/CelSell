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

export const setUserId = userid => {
  return dispatch => {
    dispatch({type: 'SET_USERID', userid: userid});
  };
};

export const setBinId = binidata => {
  return dispatch => {
    dispatch({type: 'SET_BINID', binidata});
  };
};

export const setProductId = productdata => {
  return dispatch => {
    dispatch({type: 'SET_PRODUCTID', productdata});
  };
};

export const setImage = profileimage => {
  return dispatch => {
    dispatch({type: 'SET_IMAGE', profileimage});
  };
};
