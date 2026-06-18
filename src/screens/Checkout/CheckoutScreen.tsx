/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,

  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { OrderItem } from '../../types';

import COLORS from '../../utils/Colors';
import VectorIcon from '../../components/VectorIcon';
import { Base_Url } from '../../utils/ApiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Geolocation from '@react-native-community/geolocation';
import styles from './style';
import { isUserPremium } from '../../utils/premimumuser';

type RootStackParamList = {
  CheckoutScreen: { cartItems: OrderItem[]; total: number; address?: any };
  Payment: {
    amount: number;
    purpose: string;
    customer?: {
      name: string;
      email: string;
      mobile: string;
      address?: string;
    };
    items?: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    orderId?: string;
    metadata?: Record<string, any>;
    onSuccess?: (paymentResult: any) => void;
    onFailure?: (error: string) => void;
  };
  Address: undefined;
  Dashboard: undefined;
};

type CheckoutRouteProp = RouteProp<RootStackParamList, 'CheckoutScreen'>;

const CheckoutScreen: React.FC = () => {
  const { params } = useRoute<CheckoutRouteProp>();
  const navigation = useNavigation<any>(); // Type any use karein temporarily

  const { t } = useTranslation();

  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [customerData, setCustomerData] = useState<{
    name: string;
    email: string;
    mobile: string;
  } | null>(null);

  const getLocation = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: t('locationPermissionTitle'),
          message: t('locationPermissionMessage'),
          buttonPositive: t('ok'),
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Toast.show({
          type: 'error',
          text1: t('permissionDenied'),
          text2: t('enableLocationToSaveAddress'),
        });
        return;
      }
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
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  };


  useEffect(() => {

    getLocation();
    fetchCustomerData();
    premimumuser();
  }, []);

  const fetchCustomerData = async () => {
    try {

      const token = await AsyncStorage.getItem('token');

      const res = await axios.get(Base_Url.getProfile, { headers: { Authorization: `Bearer ${token}` } });
      const userinfo = res?.data?.customer;
      setCustomerData({
        name: `${userinfo.f_name} ${userinfo.l_name}`,
        email: userinfo.email,
        mobile: userinfo.phone,
      });
    } catch (error) {
      console.log('Error fetching customer data:', error);
    }
  };

  const calculateTotals = () => {
    let subTotal = 0;
    let totalProductDiscount = 0;
    let totalTax = 0;
    let totalShipping = 0;

    params.cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subTotal += itemTotal;

      let discountAmount = 0;
      if (isPremium) {
        if (item.discount_type === 'flat') {
          discountAmount = item.discount * item.quantity;
        } else if (item.discount_type === 'percent') {
          discountAmount = (item.price * item.discount / 100) * item.quantity;
        }
      }
      totalProductDiscount += discountAmount;

      let taxAmount = (item.tax / 100) * item.price * item.quantity;
      totalTax += taxAmount;

      totalShipping += item.shipping_cost;
    });

    const totalBeforeDiscount = subTotal + totalTax + totalShipping;

    const total = totalBeforeDiscount - totalProductDiscount - couponDiscount;

    return {
      subTotal,
      totalProductDiscount,
      totalTax,
      totalShipping,
      total,
      totalBeforeDiscount,
    };
  };

  const {
    subTotal,
    totalProductDiscount,
    totalTax,
    totalShipping,
    total,
    totalBeforeDiscount,
  } = calculateTotals();

  const handleApplyCoupon = () => {
    if (couponApplied) {
      Toast.show({
        type: 'info',
        text1: t('coupon'),
        text2: t('alreadyApplied'),
      });
      return;
    }
    if (coupon.trim().toUpperCase() === 'SAVE10') {
      setCouponDiscount(10);
      setCouponApplied(true);
      Toast.show({
        type: 'success',
        text1: t('coupon'),
        text2: t('couponApplied'),
      });
    } else if (coupon.trim().toUpperCase() === 'SAVE20') {
      setCouponDiscount(20);
      setCouponApplied(true);
      Toast.show({
        type: 'success',
        text1: t('coupon'),
        text2: t('couponApplied'),
      });
    } else {
      setCouponDiscount(0);
      setCouponApplied(false);
      Toast.show({
        type: 'error',
        text1: t('coupon'),
        text2: t('invalidCoupon'),
      });
    }
  };

  const premimumuser = async () => {
    try {
      const premimum = await isUserPremium();
      setIsPremium(premimum);
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    }
  };

  const handleCheckout = async () => {



    const paymentParams = {
      amount: total,
      purpose: 'order' as const,
      customer: {
        name: customerData?.name,
        email: customerData?.email,
        mobile: customerData?.mobile,
        address: params.address,
      },
      items: params.cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
      })),
      cartItems: params.cartItems,
      address: params.address,
      metadata: {
        cartItems: params.cartItems,
        address: params.address,
        latitude,
        longitude,
        couponDiscount,
         totalDiscount: totalProductDiscount,
        totalTax,
        totalShipping,
        isPremium: isPremium,
        totalBeforeDiscount,
      },
      customerId: 1,


      onFailure: (error: string) => {
        Toast.show({
          type: 'error',
          text1: 'Payment Failed',
          text2: error,
        });
      },
    };

    navigation.navigate('Payment', paymentParams);
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f5f8' }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <VectorIcon size={24} type="AntDesign" name="left" color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('orderSummary')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={{
          backgroundColor: isPremium ? '#E8F5E9' : '#FFF3E0',
          padding: 12,
          borderRadius: 8,
          marginHorizontal: 16,
          marginBottom: 16,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: isPremium ? '#C8E6C9' : '#FFE0B2',
        }}>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: isPremium ? COLORS.success : COLORS.warn,
          }}>
            {isPremium ? t('premiummember') : t('anyplansubscribe')}
          </Text>
        </View>
        {/* Summary */}
        <View style={styles.summaryBox}>
          <View style={styles.row}><Text style={styles.label}>{t('subTotal')}</Text><Text style={styles.value}>{subTotal.toFixed(2)} ﷼</Text></View>
          <View style={styles.row}><Text style={styles.label}>{t('tax')}</Text><Text style={styles.value}>{totalTax.toFixed(2)} ﷼</Text></View>
          <View style={styles.row}><Text style={styles.label}>{t('shipping')}</Text><Text style={styles.value}>{totalShipping.toFixed(2)} ﷼</Text></View>
         {isPremium && totalProductDiscount > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>
                {t('discount')} {isPremium && '🎉'}
              </Text>
              <Text style={[styles.value, { color: '#4caf50' }]}>
                - {totalProductDiscount.toFixed(2)} ﷼
              </Text>
            </View>
          )}
          {couponApplied && (
            <View style={styles.row}>
              <Text style={styles.label}>{t('couponDiscount')}</Text>
              <Text style={[styles.value, { color: '#4caf50' }]}>- {couponDiscount.toFixed(2)} ﷼</Text>
            </View>
          )}
          {!isPremium && params.cartItems.some(item => item.discount > 0) && (
            <View style={[styles.row, { backgroundColor: '#FFF3E0', padding: 8, borderRadius: 4 }]}>
              <Text style={[styles.label, { color: COLORS.warn, fontSize: 12 }]}>{t('nonpremimum')}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={[styles.label, styles.totalLabel]}>{t('total')}</Text>
            <Text style={[styles.value, styles.totalValue]}>{total.toFixed(2)} ﷼</Text>
          </View>
        </View>

        {/* Coupon */}
        <View style={styles.couponRow}>
          <TextInput
            style={styles.couponInput}
            placeholder={t('enterCoupon')}
            value={coupon}
            onChangeText={setCoupon}
            editable={!couponApplied}
          />
          <TouchableOpacity
            style={[styles.couponBtn, couponApplied && { backgroundColor: '#bdbdbd' }]}
            onPress={handleApplyCoupon}
            disabled={couponApplied}
          >
            <Text style={styles.couponBtnText}>
              {couponApplied ? t('applied') : t('apply')}
            </Text>
          </TouchableOpacity>
        </View>


        <View style={styles.featuresRow}>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="truck-fast" size={28} color="#4caf50" />
            <Text style={styles.featureText}>{t('fastDelivery')}</Text>
          </View>
          <View style={styles.feature}>
            <FontAwesome5 name="shield-alt" size={28} color="#2196f3" />
            <Text style={styles.featureText}>{t('safePayment')}</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="refresh-circle" size={28} color="#ff9800" />
            <Text style={styles.featureText}>{t('returnPolicy')}</Text>
          </View>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="certificate" size={28} color="#9c27b0" />
            <Text style={styles.featureText}>{t('product100')}</Text>
          </View>
        </View>

        {/* Buttons */}
        <TouchableOpacity
          style={[styles.checkoutBtn, isProcessing && { opacity: 0.5 }]}
          onPress={handleCheckout}
          disabled={isProcessing}
        >
          <Text style={styles.checkoutBtnText}>
            {isProcessing ? t('Processing') : t('placeorder')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.continueBtnText}>{t('continueshopping')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

