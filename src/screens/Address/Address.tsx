/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  PermissionsAndroid,
  Modal,            
  KeyboardAvoidingView,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import COLORS from '../../utils/Colors';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import VectorIcon from '../../components/VectorIcon';
import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { Base_Url } from '../../utils/ApiUrl';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Address'>;

const Address: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [billing, setBilling] = useState('Others');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [country, setCountry] = useState<Country | null>(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const route = useRoute();
  const editAddress = (route.params as any)?.address || null;

  const { t } = useTranslation();
  useEffect(() => {
    if (editAddress) {
      setName(editAddress.contact_person_name || '');
      setPhone(editAddress.phone || '');
      setBilling(editAddress.address_type || 'Others');

      setCountry({
        cca2: editAddress.country || '',
        name: editAddress.country || '',
      } as Country);

      setCity(editAddress.city || '');
      setPostcode(editAddress.zip || '');
      setAddress(editAddress.address || '');
      setLatitude(editAddress.latitude || '');
      setLongitude(editAddress.longitude || '');
    }
  }, [editAddress]);


  useEffect(() => {
    if (editAddress) { return; }

    const getLocation = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) { return; }
      }

      Geolocation.getCurrentPosition(
        pos => {
          setLatitude(pos.coords.latitude.toString());
          setLongitude(pos.coords.longitude.toString());
        },
        err =>
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: err.message,
          }),
        { enableHighAccuracy: false, timeout: 25000, maximumAge: 10000 }
      );
    };

    getLocation();
  }, [editAddress]);


  const handleSave = async () => {
    if (!name || !phone || !billing || !country || !city || !postcode || !address) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('pleaseFillAllFields'),
      });
      return;
    }

    const token = await AsyncStorage.getItem('token');
    if (!token) { return; }

    const payload = {
      contact_person_name: name,
      phone,
      address_type: billing,
      country: country.name,
      city,
      zip: postcode,
      address,
      is_billing: 1,
      latitude,
      longitude,
    };

    try {
      const response = await axios.post(Base_Url.address, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.status === 200) {
        (navigation as any).navigate('Dashboard', {
          screen: 'AddtoCart',
          params: { selectedAddress: response?.data?.data },
        });
      }
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('failedToSaveAddress'),
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>

        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <VectorIcon type="AntDesign" name="left" size={24} color={COLORS.textColor} />
          </TouchableOpacity>

          <Text style={styles.heading}>{t('shippingAddress')} *</Text>

          <Text style={styles.label}>{t('contactPersonName')} *</Text>
          <CustomInput value={name} onChangeText={setName} placeholder="Enter name" style={styles.input} />

          <Text style={styles.label}>{t('phone')} *</Text>
          <CustomInput value={phone} onChangeText={setPhone} placeholder={t('enterPhone')} keyboardType="phone-pad" style={styles.input} />

          <Text style={styles.label}>{t('addressType')}</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowBillingModal(true)}>
            <Text>{billing}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>{t('country')} *</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowCountryPicker(true)}>
            <Text>
              {typeof country?.name === 'string'
                ? country.name
                : 'Select Country'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>{t('city')} *</Text>
          <CustomInput value={city} onChangeText={setCity} placeholder={t('enterCity')} style={styles.input} />

          <Text style={styles.label}>{t('zipCode')} *</Text>
          <CustomInput value={postcode} onChangeText={setPostcode} placeholder={t('enterZipCode')} keyboardType="numeric" style={styles.input} />

          <Text style={styles.label}>{t('address')} *</Text>
          <CustomInput value={address} onChangeText={setAddress} placeholder={t('enterAddress')} style={styles.input} />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{t('saveChanges')}</Text>
          </TouchableOpacity>


          <Modal visible={showBillingModal} transparent animationType="slide">
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowBillingModal(false)}>
              <View style={styles.modalContent}>
                {[t('permanent'), t('home'), t('others')].map(type => (
                  <TouchableOpacity key={type} onPress={() => { setBilling(type); setShowBillingModal(false); }}>
                    <Text style={styles.modalItem}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
          {showCountryPicker && (
            <CountryPicker
              withFilter
              withFlag
              withCountryNameButton={false}
              withAlphaFilter
              withCallingCode
              withEmoji
              visible={showCountryPicker}
              onClose={() => setShowCountryPicker(false)}
              onSelect={selectedCountry => {
                setCountry(selectedCountry);
                setShowCountryPicker(false);
              }}

              theme={{
                fontSize: 16,
              }} countryCode={'AF'} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

export default Address;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    padding: 16,
    paddingBottom: 50,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
    color: COLORS.textColor,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  saveBtn: {
    backgroundColor: COLORS.appColor,
    padding: 14,
    marginTop: 30,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  backButton: {
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalItem: {
    fontSize: 16,
    paddingVertical: 10,
  },
});
