import React, {Component} from 'react';

const transferProduct = async () => {
  let data = {
    Type: 5,
    Pro_Bin_PkeyID: this.state.transferbinid,
    Pro_PkeyID: this.state.productid,
  };
  console.log(data, 'datatata');
  try {
    const token = await AsyncStorage.getItem('token');
    const res = await addupdateproducts(data, token);
    console.log('trasnfered:', res);
    this.showMessage('Item Moved');
    this.setState({loading: false}, () => this.getToken());
  } catch (error) {
    showerrorMessage(error.response.data.error_description);
  }
};

export default transferProduct;
