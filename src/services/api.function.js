import axios from 'axios';
import {API, BASE_URL} from './api.types';

export const register = async data => {
  return axios(`${BASE_URL}${API.REGISTRATION_API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    data: data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const login = async data => {
  return axios(`${BASE_URL}${API.LOGIN_API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    data: data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const forgotpassword = async data => {
  return axios(`${BASE_URL}${API.FORGOT_PASSWORD}`, {
    method: 'POST',
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const resetpassword = async data => {
  return axios(`${BASE_URL}${API.RESET_PASSWORD}`, {
    method: 'POST',
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const userprofile = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_USER_MASTER_DATA}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data: data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const updateuserprofile = async (data, access_token) => {
  return axios(`${BASE_URL}${API.UPDATE_USER_MASTER_DATA}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data: data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const registerStoreImage = async (data, access_token) => {
  return axios(`${BASE_URL}${API.STORE_IMAGE_API}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const addprofile = async (data, access_token) => {
  return axios(`${BASE_URL}${API.ADD_PROFILE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getprofiles = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_PROFILES}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const updateprofile = async (data, access_token) => {
  return axios(`${BASE_URL}${API.UPDATE_PROFILE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const deleteprofile = async (data, access_token) => {
  return axios(`${BASE_URL}${API.DELETE_PROFILE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const activeprofile = async (data, access_token) => {
  return axios(`${BASE_URL}${API.ACTIVE_PROFILE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getlocation = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_LOCATION}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const createbin = async (data, access_token) => {
  return axios(`${BASE_URL}${API.CREATE_BIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const updatebin = async (data, access_token) => {
  return axios(`${BASE_URL}${API.UPDATE_BIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getbins = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_BIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const uploadimage = async (data, access_token) => {
  return axios(`${BASE_URL}${API.UPLOAD_IMAGE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getproducts = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_PRODUCTS}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const addupdateproducts = async (data, access_token) => {
  return axios(`${BASE_URL}${API.ADD_UPDATE_PRODUCT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const uploadqrimage = async (data, access_token) => {
  return axios(`${BASE_URL}${API.UPLOAD_QR_IMAGE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getcategorymaster = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_CATEGORY_MASTER}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getsubcategorymaster = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_SUBCATEGORY_MASTER}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getvendormaster = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_VENDOR_MASTER_DATA}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getcolor = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_COLOR_DATA}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getsearch = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_SEARCH_DATA}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getpdf = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_PDF}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getcsv = async (data, access_token) => {
  return axios(`${BASE_URL}${API.GET_CSV}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + access_token,
    },
    data,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};
