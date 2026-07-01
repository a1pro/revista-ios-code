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
  Alert,
  ScrollView,
  Text,
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
  const { t } = useTranslation();

  useEffect(() => {
    if (route.params?.userData) {
      const user = route.params.userData;
      setName(user.f_name || '');
      setLastName(user.l_name || '');
      setPhoneNumber(user.phone || '');
      setEmail(user.email || '');
      if (user.image) {
        setProfileImage({ uri: `${base_url}${user.image}` });
      }
    }
  }, [route.params]);

  const handleImagePick = (type: 'camera' | 'gallery') => {
    setModalVisible(false);
    const options = {
      mediaType: 'photo' as const,
      quality: 0.7,
    };

    const callback = (response: ImagePickerResponse) => {
  if (response.didCancel) {
    return;
  }

  if (response.errorCode) {
    console.log(response.errorMessage);
    return;
  }

  if (response.assets?.length) {
    const asset = response.assets[0];

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
    setLoading(true);

    const token = await AsyncStorage.getItem('token');

    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Token not found',
      });
      return;
    }

    const formData = new FormData();

    // Only append if user entered value
    if (name?.trim()) {
      formData.append('f_name', name.trim());
    }

    if (lastName?.trim()) {
      formData.append('l_name', lastName.trim());
    }

    if (phoneNumber?.trim()) {
      formData.append('phone', phoneNumber.trim());
    }

    if (password?.trim()) {
      formData.append('password', password.trim());
    }

    // Upload image only if selected
    if (imageAsset?.uri) {
      formData.append('image', {
        uri: imageAsset.uri,
        type: imageAsset.type || 'image/jpeg',
        name: imageAsset.fileName || `profile_${Date.now()}.jpg`,
      } as any);
    }


    const response = await axios.post(
      Base_Url.updateProfile,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );


    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: response.data.message || 'Profile Updated',
    });

    navigation.goBack();
  } catch (error: any) {
    console.log('UPDATE ERROR =>', error?.response?.data);

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2:
        error?.response?.data?.message ||
        JSON.stringify(error?.response?.data?.errors) ||
        'Profile update failed',
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
          <CustomInput
            value={phoneNumber}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
            style={styles.input}
          />

          <CustomText
            style={styles.label}
            fontWeight="bold"
            color={COLORS.textColor}>
            {t('password')}
          </CustomText>
          <CustomInput
            value={password}
            placeholder="Password"
            type="password"
            onChangeText={setPassword}
            style={styles.input}
          />


          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            <Text

              style={styles.saveButtonText}>
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
                  // eslint-disable-next-line react-native/no-inline-styles
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
    backgroundColor: COLORS.black,
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

