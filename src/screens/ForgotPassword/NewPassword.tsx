// /* eslint-disable react-native/no-inline-styles */
// import React, {useState} from 'react';
// import {View, ImageBackground, Image} from 'react-native';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {RootStackParamList} from '../../types';
// import styles from './style';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import IMAGES from '../../assets/images';
// import {CustomText} from '../../components/CustomText';
// import COLORS from '../../utils/Colors';
// import CustomButton from '../../components/Buttons/CustomButton';
// import {horizontalScale, verticalScale} from '../../utils/Metrics';
// import {KeyboardAvoidingContainer} from '../../components/KeyboardAvoidingComponent';
// import CustomInput from '../../components/CustomInput';

// type Props = NativeStackScreenProps<RootStackParamList, 'NewPassword'>;

// const NewPassword: React.FC<Props> = ({navigation}) => {
//   // const [selected, setSelected] = useState<'sms' | 'email'>('sms');
//   const [inputData, setInputData] = useState({
//     email: '',
//     password: '',
//   });

//   const handleInputChange = (fieldName: string, value: string) => {
//     setInputData(prev => ({
//       ...prev,
//       [fieldName]: value,
//     }));
//   };

//   return (
//     <KeyboardAvoidingContainer>
//       <SafeAreaView style={styles.container}>
//         <ImageBackground
//           source={IMAGES.passwordbackground}
//           resizeMode="cover"
//           style={{flex: 1, width: '100%', height: '100%'}}>
//           <View style={styles.mainView}>
//             <Image
//               source={IMAGES.imgplaceholder}
//               style={styles.userImage}
//               resizeMode="contain"
//             />
//             <CustomText
//               type="heading"
//               color={COLORS.textColor}
//               fontWeight="bold"
//               style={{textAlign: 'center', marginBottom: 10}}>
//               Setup New Password
//             </CustomText>
//             <CustomText
//               type="subTitle"
//               color={COLORS.textColor}
//               style={{textAlign: 'center'}}>
//               Please, setup a new password for your account
//             </CustomText>
//             <View style={styles.inputContainer}>
//               <CustomInput
//                 value={inputData.password}
//                 placeholder="Password"
//                 type="password"
//                 onChangeText={value => handleInputChange('password', value)}
//               />
//               <CustomInput
//                 value={inputData.password}
//                 placeholder="New Password"
//                 type="password"
//                 onChangeText={value => handleInputChange('password', value)}
//               />
//             </View>
//           </View>

//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'center',
//               paddingHorizontal: horizontalScale(15),
//             }}>
//             <CustomButton
//               style={{marginTop: verticalScale(50)}}
//               textSize="small"
//               title="Save"
//               onPress={() => navigation.navigate('Login')}
//             />
//             <CustomText
//               type="subTitle"
//               color={COLORS.textColor}
//               style={{textAlign: 'center', marginTop: verticalScale(20)}}
//               onPress={() => navigation.navigate('Login')}>
//               Cancel
//             </CustomText>
//           </View>
//         </ImageBackground>
//       </SafeAreaView>
//     </KeyboardAvoidingContainer>
//   );
// };

// export default NewPassword;
