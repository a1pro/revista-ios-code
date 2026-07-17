/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Modal,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import IMAGES from '../../assets/images';
import { CustomText } from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import COLORS from '../../utils/Colors';
import { verticalScale } from '../../utils/Metrics';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';
import VectorIcon from '../../components/VectorIcon';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import RNFS from 'react-native-fs';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const EditProfile: React.FC<Props> = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<any>(IMAGES.imgplaceholder);
  const [imageAsset, setImageAsset] = useState<Asset | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (route.params?.userData) {
      const user = route.params.userData;
      setName(user.f_name || '');
      setLastName(user.l_name || '');
      
      // Format phone number for display (remove country code if exists)
      if (user.phone) {
        const formattedPhone = user.phone.replace(/^\+?966/, '').trim();
        setPhoneNumber(formattedPhone);
      }
      
      setEmail(user.email || '');
      if (user.image) {
        setProfileImage({ uri: `${base_url}${user.image}` });
      }
    }
  }, [route.params]);

  // Validate Saudi phone number
  const validateSaudiPhone = (number: string): boolean => {
    // Remove all non-numeric characters
    const cleaned = number.replace(/[^0-9]/g, '');
    
    // Check if it starts with 5 (Saudi mobile) or 0 (if user includes it)
    const isValid = cleaned.length >= 9 && cleaned.length <= 11 && 
                    (cleaned.startsWith('5') || cleaned.startsWith('05'));
    
    return isValid;
  };

  // Format phone number as user types
  const formatPhoneNumber = (text: string) => {
    // Remove any non-numeric characters
    let cleaned = text.replace(/[^0-9]/g, '');
    
    // If user enters 966, remove it (they should only enter local number)
    if (cleaned.startsWith('966')) {
      cleaned = cleaned.substring(3);
    }
    
    // Limit to 11 digits (max for Saudi number)
    if (cleaned.length > 11) {
      cleaned = cleaned.substring(0, 11);
    }
    
    // Update state with cleaned number
    setPhoneNumber(cleaned);
    
    // Validate
    if (cleaned.length > 0) {
      if (cleaned.length < 9) {
        setPhoneError(t('phoneMinLength'));
      } else if (cleaned.length > 11) {
        setPhoneError(t('phoneMaxLength'));
      } else if (!cleaned.startsWith('5') && !cleaned.startsWith('05')) {
        setPhoneError(t('phoneInvalid') );
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  };

  const handleImagePick = (type: 'camera' | 'gallery') => {
    setModalVisible(false);
    const options = {
      mediaType: 'photo' as const,
      quality: 0.3,
      maxWidth: 400,
      maxHeight: 400,
    };

    const callback = (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.errorMessage || 'Failed to select image',
        });
        return;
      }

      if (response.assets?.length) {
        const asset = response.assets[0];
        
        if (!asset.uri) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Invalid image selected',
          });
          return;
        }

        setImageAsset(asset);
        setProfileImage({
          uri: asset.uri,
        });
      }
    };

    if (type === 'camera') {
      launchCamera(options, callback);
    } else {
      launchImageLibrary(options, callback);
    }
  };

  const handleSave = async () => {
    try {
      // Validate phone number before saving
      const cleanedPhone = phoneNumber.replace(/[^0-9]/g, '');
      
      if (cleanedPhone) {
        if (cleanedPhone.length < 9) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: t('phoneMinLength') || 'Phone number must be at least 9 digits',
          });
          return;
        }
        
        if (cleanedPhone.length > 11) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: t('phoneMaxLength') || 'Phone number must be at most 11 digits',
          });
          return;
        }
        
        if (!cleanedPhone.startsWith('5') && !cleanedPhone.startsWith('05')) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: t('phoneInvalid') || 'Saudi phone number must start with 5',
          });
          return;
        }
      }

      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Token not found',
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();

      if (name?.trim()) {
        formData.append('f_name', name.trim());
      }

      if (lastName?.trim()) {
        formData.append('l_name', lastName.trim());
      }

      // Add country code +966 to phone number before sending
      if (phoneNumber?.trim()) {
        // Remove any non-numeric and existing country code
        let cleanPhone = phoneNumber.trim().replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('966')) {
          cleanPhone = cleanPhone.substring(3);
        }
        // Add +966 country code
        const fullPhoneNumber = `+966${cleanPhone}`;
        formData.append('phone', fullPhoneNumber);
      }

      if (imageAsset?.uri) {
        try {
          let filePath = imageAsset.uri;
          
          if (Platform.OS === 'android' && filePath.startsWith('file://')) {
            filePath = filePath.replace('file://', '');
          }
          
          const fileExtension = imageAsset.fileName?.split('.').pop() || 'jpg';
          const fileName = imageAsset.fileName || `profile_${Date.now()}.${fileExtension}`;
          const mimeType = imageAsset.type || `image/${fileExtension}`;
          
          if (Platform.OS === 'android') {
            await RNFS.readFile(filePath, 'base64');
            
            formData.append('image', {
              uri: `file://${filePath}`,
              type: mimeType,
              name: fileName,
            } as any);
          } else {
            formData.append('image', {
              uri: filePath,
              type: mimeType,
              name: fileName,
            } as any);
          }
          
        } catch (imageError) {
          console.error('❌ Error processing image:', imageError);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to process image. Please try again.',
          });
          setLoading(false);
          return;
        }
      }

      const response = await axios.post(
        Base_Url.updateProfile,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        },
      );

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.data.message || 'Profile Updated',
      });

      navigation.goBack();
      
    } catch (error: any) {
      let errorMessage = 'Profile update failed';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (typeof errors === 'object') {
          errorMessage = Object.values(errors).flat().join(', ');
        } else {
          errorMessage = String(errors);
        }
      } else if (error?.message === 'Network Error') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.container}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <VectorIcon
              type="AntDesign"
              name="left"
              size={24}
              color={COLORS.textColor}
            />
          </TouchableOpacity>

          <CustomText
            type="heading"
            color={COLORS.textColor}
            fontWeight="bold"
            style={styles.headerText}>
            {t('myprofile')}
          </CustomText>

          <View style={styles.profileSection}>
            <Image source={profileImage} style={styles.profileImage} />
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={() => setModalVisible(true)}>
              <Icon name="edit" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <CustomText
            style={styles.label}
            fontWeight="bold"
            color={COLORS.textColor}>
            {t('name')}
          </CustomText>
          <CustomInput
            value={name}
            placeholder="Name"
            onChangeText={setName}
            style={styles.input}
          />
          
          <CustomText
            style={styles.label}
            fontWeight="bold"
            color={COLORS.textColor}>
            {t('lastname')}
          </CustomText>
          <CustomInput
            value={lastName}
            placeholder="Last Name"
            onChangeText={setLastName}
            style={styles.input}
          />
          
          <CustomText
            style={styles.label}
            fontWeight="bold"
            color={COLORS.textColor}>
            {t('phoneNumber')}
          </CustomText>
          
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeContainer}>
              <Text style={styles.countryCodeText}>+966</Text>
            </View>
            <CustomInput
              value={phoneNumber}
              placeholder="5XXXXXXXX"
              keyboardType="phone-pad"
              onChangeText={formatPhoneNumber}
              style={[styles.input, styles.phoneInput, phoneError ? styles.inputError : null]}
              maxLength={11}
            />
          </View>
          
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : (
            <Text style={styles.hintText}>
              {t('phoneHint') || 'Enter 9-11 digits starting with 5 (e.g., 5XXXXXXXX)'}
            </Text>
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? t('saving') : t('saveChanges')}
            </Text>
          </TouchableOpacity>
          
          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}>
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setModalVisible(false)}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleImagePick('camera')}>
                  <CustomText color={COLORS.textColor} fontWeight="bold">
                    {t('camera')}
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => handleImagePick('gallery')}>
                  <CustomText color={COLORS.textColor} fontWeight="bold">
                    {t('gallery')}
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalOption, { borderBottomWidth: 0 }]}
                  onPress={() => setModalVisible(false)}>
                  <CustomText color="red" fontWeight="bold">
                    {t('cancel')}
                  </CustomText>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(20),
    left: 10,
    zIndex: 1,
    padding: 8,
  },
  headerText: {
    textAlign: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
    fontSize: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
    justifyContent: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 110,
    backgroundColor: COLORS.appColor || '#0066FF',
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  label: {
    marginTop: verticalScale(10),
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    marginBottom: verticalScale(8),
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  countryCodeContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  countryCodeText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    marginBottom: 0,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: verticalScale(8),
    marginTop: verticalScale(2),
  },
  hintText: {
    color: '#999',
    fontSize: 12,
    marginBottom: verticalScale(8),
    marginTop: verticalScale(2),
  },
  saveButton: {
    backgroundColor: COLORS.btnbg,
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: verticalScale(32),
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
});

export default EditProfile;