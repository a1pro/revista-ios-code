
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  PermissionsAndroid,
  Modal,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import COLORS from '../../utils/Colors';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VectorIcon from '../../components/VectorIcon';
import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { Base_Url } from '../../utils/ApiUrl';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dropdown } from 'react-native-element-dropdown';

type Props = NativeStackScreenProps<RootStackParamList, 'Address'>;

const Address: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [billing, setBilling] = useState('Others');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [zipcodes, setZipcodes] = useState<any[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedZip, setSelectedZip] = useState<any>(null);

  const route = useRoute();
  const editAddress = (route.params as any)?.address || null;

  const { t } = useTranslation();

  // Get screen height for dropdown
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (editAddress) {
      setName(editAddress.contact_person_name || '');

      // Format phone number for display (remove country code if exists)
      if (editAddress.phone) {
        const formattedPhone = editAddress.phone.replace(/^\+?966/, '').trim();
        setPhone(formattedPhone);
      }

      setBilling(editAddress.address_type || 'Others');
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
    setPhone(cleaned);

    // Validate
    if (cleaned.length > 0) {
      if (cleaned.length < 9) {
        setPhoneError(t('phoneMinLength') || 'Phone number must be at least 9 digits');
      } else if (cleaned.length > 11) {
        setPhoneError(t('phoneMaxLength') || 'Phone number must be at most 11 digits');
      } else if (!cleaned.startsWith('5') && !cleaned.startsWith('05')) {
        setPhoneError(t('phoneInvalid') || 'Saudi phone number must start with 5');
      } else {
        setPhoneError('');
      }
    } else {
      setPhoneError('');
    }
  };

  const handleSave = async () => {
    // Validate phone number before saving
    const cleanedPhone = phone.replace(/[^0-9]/g, '');

    if (cleanedPhone) {
      if (cleanedPhone.length < 9) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('phoneMinLength') || 'Phone number must be at least 9 digits',
        });
        return;
      }

      if (cleanedPhone.length > 11) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('phoneMaxLength') || 'Phone number must be at most 11 digits',
        });
        return;
      }

      if (!cleanedPhone.startsWith('5') && !cleanedPhone.startsWith('05')) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('phoneInvalid') || 'Saudi phone number must start with 5',
        });
        return;
      }
    }

    if (!name || !phone || !billing || !selectedCountry || !selectedCity || !selectedZip || !address) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('pleaseFillAllFields'),
      });
      return;
    }

    const token = await AsyncStorage.getItem('token');
    if (!token) { return; }

    // Add country code +966 to phone number before sending
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('966')) {
      cleanPhone = cleanPhone.substring(3);
    }
    // Add +966 country code
    const fullPhoneNumber = `+966${cleanPhone}`;

    const payload = {
      contact_person_name: name,
      phone: fullPhoneNumber,
      address_type: billing,
      country: selectedCountry?.name,
      state: selectedState?.name,
      city: selectedCity?.name,
      zip: selectedZip?.zipcode,
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
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('failedToSaveAddress'),
      });
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch Countries
  const fetchCountries = async () => {
    try {
      const response = await axios.get(Base_Url.countryApi);
      if (response.data?.success === true || response.data?.status === 200) {
        let countryData = [];
        if (Array.isArray(response.data.data)) {
          countryData = response.data.data;
        } else if (response.data.data && typeof response.data.data === 'object') {
          countryData = [response.data.data];
        } else {
          countryData = [];
        }
        setCountries(countryData);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'Failed to fetch countries',
      });
    }
  };

  // Fetch States - Fixed to handle both 'success' and 'status' responses
  const fetchStates = async (countryId: string) => {
    try {
      const response = await axios.get(
        `${Base_Url.stateapi}/${countryId}`
      );

      if (response.data?.success === true || response.data?.status === 200) {
        const stateData = Array.isArray(response.data.data) ? response.data.data : [];
        setStates(stateData);
      } else {
        setStates([]);
      }
    } catch (error) {
      setStates([]);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'Failed to fetch states',
      });
    }
  };

  // Fetch Cities - Fixed to handle both 'success' and 'status' responses
  const fetchCities = async (stateId: string) => {
    try {
      const response = await axios.get(
        `${Base_Url.cityapi}/${stateId}`
      );

      if (response.data?.success === true || response.data?.status === 200) {
        const cityData = Array.isArray(response.data.data) ? response.data.data : [];
        setCities(cityData);
      } else {
        setCities([]);
      }
    } catch (error) {
      setCities([]);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'Failed to fetch cities',
      });
    }
  };

  // Fetch Zipcodes - Fixed to handle both 'success' and 'status' responses
  const fetchZipcodes = async (cityId: string) => {
    try {
      const response = await axios.get(
        `${Base_Url.zipcodeapi}/${cityId}`
      );

      if (response.data?.success === true || response.data?.status === 200) {
        const zipData = Array.isArray(response.data.data) ? response.data.data : [];
        setZipcodes(zipData);
      } else {
        setZipcodes([]);
      }
    } catch (error) {
      setZipcodes([]);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'Failed to fetch zip codes',
      });
    }
  };

  // Custom render item for dropdown
  const renderItem = (item: any) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.name || item.zipcode}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}>

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <VectorIcon type="AntDesign" name="left" size={24} color={COLORS.textColor} />
          </TouchableOpacity>

          <Text style={styles.heading}>{t('shippingAddress')} *</Text>

          <Text style={styles.label}>{t('contactPersonName')} *</Text>
          <CustomInput value={name} onChangeText={setName} placeholder="Enter name" style={styles.input} />

          <Text style={styles.label}>{t('phone')} *</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeContainer}>
              <Text style={styles.countryCodeText}>+966</Text>
            </View>
            <CustomInput
              value={phone}
              onChangeText={formatPhoneNumber}
              placeholder="5XXXXXXXX"
              keyboardType="phone-pad"
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

          <Text style={styles.label}>{t('addressType')}</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowBillingModal(true)}>
            <Text>{billing}</Text>
          </TouchableOpacity>

          {/* Country Dropdown */}
          <Text style={styles.label}>Country *</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              data={countries}
              labelField="name"
              valueField="id"
              placeholder={countries.length > 0 ? "Select Country" : "Loading countries..."}
              value={selectedCountry?.id}
              onChange={(item) => {
                setSelectedCountry(item);
                setSelectedState(null);
                setSelectedCity(null);
                setSelectedZip(null);
                setStates([]);
                setCities([]);
                setZipcodes([]);
                fetchStates(item.id);
              }}
              maxHeight={screenHeight * 0.5}
              minHeight={200}
              containerStyle={styles.dropdownListContainer}
              itemContainerStyle={styles.dropdownItemContainer}
              activeColor="#f0f0f0"
              showsVerticalScrollIndicator={true}
              renderItem={renderItem}
              search={false}
            />
          </View>

          {/* State Dropdown - Removed disable prop to ensure it's always interactive */}
          <Text style={styles.label}>State *</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              data={states}
              labelField="name"
              valueField="id"
              placeholder={states.length > 0 ? "Select State" : "No states available"}
              value={selectedState?.id}
              onChange={(item) => {
                setSelectedState(item);
                setSelectedCity(null);
                setSelectedZip(null);
                setCities([]);
                setZipcodes([]);
                fetchCities(item.id);
              }}
              maxHeight={screenHeight * 0.5}
              minHeight={200}
              containerStyle={styles.dropdownListContainer}
              itemContainerStyle={styles.dropdownItemContainer}
              activeColor="#f0f0f0"
              showsVerticalScrollIndicator={true}
              renderItem={renderItem}
              search={false}
            />
          </View>

          {/* City Dropdown */}
          <Text style={styles.label}>City *</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              data={cities}
              labelField="name"
              valueField="id"
              placeholder={cities.length > 0 ? "Select City" : "No cities available"}
              value={selectedCity?.id}
              onChange={(item) => {
                setSelectedCity(item);
                setCity(item.name);
                setSelectedZip(null);
                setZipcodes([]);
                fetchZipcodes(item.id);
              }}
              maxHeight={screenHeight * 0.5}
              minHeight={200}
              containerStyle={styles.dropdownListContainer}
              itemContainerStyle={styles.dropdownItemContainer}
              activeColor="#f0f0f0"
              showsVerticalScrollIndicator={true}
              renderItem={renderItem}
              search={false}
            />
          </View>

          {/* Zip Code Dropdown */}
          <Text style={styles.label}>Zip Code *</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.itemTextStyle}
              data={zipcodes}
              labelField="zipcode"
              valueField="id"
              placeholder={zipcodes.length > 0 ? "Select Zip Code" : "No zip codes available"}
              value={selectedZip?.id}
              onChange={(item) => {
                setSelectedZip(item);
                setPostcode(item.zipcode);
              }}
              maxHeight={screenHeight * 0.5}
              minHeight={200}
              containerStyle={styles.dropdownListContainer}
              itemContainerStyle={styles.dropdownItemContainer}
              activeColor="#f0f0f0"
              showsVerticalScrollIndicator={true}
              renderItem={(item) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemText}>{item.zipcode}</Text>
                </View>
              )}
              search={false}
            />
          </View>

          <Text style={styles.label}>{t('address')} *</Text>
          <CustomInput value={address} onChangeText={setAddress} placeholder={t('enterAddress')} style={styles.input} />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{t('saveChanges')}</Text>
          </TouchableOpacity>

          {/* Billing Type Modal */}
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
    paddingBottom: 100,
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  countryCodeContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  countryCodeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  hintText: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: COLORS.white,
    marginTop: 4,
    zIndex: 1000,
    minHeight: 45,
  },
  dropdown: {
    height: 45,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000',
  },
  itemTextStyle: {
    fontSize: 14,
    color: '#000',
  },
  dropdownListContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 9999,
    paddingVertical: 5,
    maxHeight: 300,
  },
  dropdownItemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 14,
    color: '#000',
  },
  searchInputStyle: {
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 40,
  },
  saveBtn: {
    backgroundColor: COLORS.btnbg,
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