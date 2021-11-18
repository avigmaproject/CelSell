// import React, {useState} from 'react';
// import {StyleSheet} from 'react-native';
// import DropDownPicker, {
//   ListModeType,
//   ValueType,
// } from 'react-native-dropdown-picker';
// import {useTheme} from 'react-native-paper';

// const DropDown = ({
//   items,
//   setItems,
//   value,
//   setValue,
//   listMode,
//   placeholder,
//   ...props
// }) => {
//   const [open, setOpen] = useState(false);

//   const toggleOpen = () => {
//     setOpen(!open);
//   };

//   return (
//     <DropDownPicker
//       open={open}
//       value={value}
//       items={items}
//       listMode={listMode}
//       setValue={setValue}
//       setItems={setItems}
//       setOpen={() => toggleOpen()}
//       placeholder={placeholder}
//     />
//   );
// };

// export default DropDown;
