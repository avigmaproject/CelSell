export const verifyEmail = email => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(email) === false) {
    return true;
  }
  return false;
};

export const verifyPassword = password => {
  let reg = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  if (reg.test(password) === false) {
    return true;
  }
  return false;
};
