// /* eslint-disable react-native/no-inline-styles */
// import React, {useState, useRef} from 'react';
// import {View, ImageBackground, Image, TextInput} from 'react-native';
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

// type Props = NativeStackScreenProps<RootStackParamList, 'PasswordRecovery'>;

// const PasswordRecovery: React.FC<Props> = ({navigation}) => {
//   const [otp, setOtp] = useState(['', '', '', '']);
//   const inputs = useRef<Array<TextInput | null>>([]);
//   const handleOtpChange = (text: string, index: number) => {
//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);

//     if (text && index < 3) {
//       inputs.current[index + 1]?.focus(); // Safe check
//     }
//   };

//   const handleKeyPress = (e: any, index: number) => {
//     if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
//       inputs.current[index - 1]?.focus();
//     }
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
//               Password Recovery
//             </CustomText>
//             <CustomText
//               type="subTitle"
//               color={COLORS.textColor}
//               style={{textAlign: 'center'}}>
//               Enter 4-digit code sent to your phone number
//             </CustomText>
//             <CustomText
//               type="subTitle"
//               color={COLORS.textColor}
//               style={{textAlign: 'center'}}>
//               95******94
//             </CustomText>
//             <View style={styles.option}>
//               {otp.map((digit, index) => (
//                 <TextInput
//                   key={index}
//                   ref={ref => {
//                     inputs.current[index] = ref;
//                   }}
//                   style={styles.otpBox}
//                   maxLength={1}
//                   keyboardType="numeric"
//                   value={digit}
//                   onChangeText={text => handleOtpChange(text, index)}
//                   onKeyPress={e => handleKeyPress(e, index)}
//                   autoFocus={index === 0}
//                 />
//               ))}
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
//               title="Next"
//               onPress={() => navigation.navigate('NewPassword')}
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

// export default PasswordRecovery;
