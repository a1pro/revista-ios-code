/* eslint-disable react-native/no-inline-styles */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CustomText } from '../../components/CustomText';
import styles from './style';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import IMAGES from '../../assets/images';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  thumbnail?: string;
  current_stock?: number;
}

interface Address {
  id: number;
  customer_id: string | null;
  is_guest: boolean;
  contact_person_name: string;
  email: string | null;
  address_type: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  created_at: string;
  updated_at: string;
  state: string | null;
  country: string;
  latitude: string;
  longitude: string;
  is_billing: boolean;
}

const AddtoCart: React.FC = () => {
  const route = useRoute<any>();
  const selectedAddress = route.params?.selectedAddress || null;

  const [selectedshippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [imageError, setImageError] = useState<boolean>(false);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [, setError] = useState<string>('');
  const { t } = useTranslation();
  const navigation = useNavigation();
  useEffect(() => {
    if (selectedAddress) {
      setShippingAddress(selectedAddress);
    }
  }, [selectedAddress]);


  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const res = await axios.get(Base_Url.getcart, {
          headers: { Authorization: `Bearer ${token}` },
          params: { guest_id: 1 },
        });

        // console.log(cartItems)
        setCartItems(Array.isArray(res?.data) ? res?.data : []);
      } else {
        return;
      }

    } catch (err) {
      console.log('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };
  // console.log("cart list :",cartItems)
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      setError('');
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setError('No token found. Please login again.');
          setAddresses([]);
          setLoading(false);
          return;
        }
        const res = await axios.get(Base_Url.getAddress, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAddresses(Array.isArray(res.data) ? res.data : []);

      } catch (err) {
        setError('Failed to fetch addresses. Please try again.');
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);





  const updateCartItem = async (itemId: number, newQuantity: number): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('noToken'),
        });
        return false;
      }

      const item = cartItems.find(i => i.id === itemId);
      if (!item) { return false; }


      const payload = {
        key: item.id,
        quantity: newQuantity,
      };

      const res = await axios.put(Base_Url.updatecart, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.data && (res.data.status === 1)) {
        return true;
      } else {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: res.data?.message || t('updateFailed'),
        });
        return false;
      }
    } catch (error: any) {
      console.log('Update cart error:', error);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error?.response?.data?.message || t('updateFailed'),
      });
      return false;
    }
  };

  const updateQuantity = async (id: number, type: 'increment' | 'decrement') => {
    const item = cartItems.find(i => i.id === id);
    if (!item) { return; }

    let newQuantity: number;

    if (type === 'increment') {

      const currentStock = item?.current_stock ?? 0;
      const maxAllowed = Math.min(currentStock);
      if (item.quantity >= maxAllowed) {
        Toast.show({
          type: 'error',
          text1: t('limitReached'),
          text2: `Maximum ${maxAllowed} items allowed. Only ${item.current_stock} in stock.`,
        });
        return;
      }
      newQuantity = item.quantity + 1;
    } else {
      newQuantity = Math.max(1, item.quantity - 1);
    }

    const oldQuantity = item.quantity;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));

    const success = await updateCartItem(id, newQuantity);

    if (!success) {
      setCartItems(prev => prev.map(item =>
        item.id === id ? { ...item, quantity: oldQuantity } : item
      ));
    }
  };

  const removeItem = async (id: number) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) { return; }
      const item = cartItems.find((i) => i.id === id);
      const formData = new FormData();
      formData.append('key', String(item?.id));
      const res = await axios.post(Base_Url.cartremove, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data && (res.data === 'Successfully removed' || res.data.message === 'Successfully removed')) {
        setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== id));
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('productRemoved'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: res.data?.message || t('failedproductRemoved'),
        });
      }
    } catch (err: any) {
      if (err.response) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: err.response.data?.message || t('failedproductRemoved'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('failedproductRemoved'),
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const validateCheckout = () => {

    if (!cartItems || cartItems.length === 0) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('cartEmpty'),
        position: 'bottom',
      });
      return false;
    }
    const total = getTotal();
    if (!total || total <= 0) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('invalidTotal'),
        position: 'bottom',
      });
      return false;
    }


    if (!shippingAddress) {
      Toast.show({
        type: 'error',
        text1: t('shippingAddressRequired'),
        text2: t('pleaseSelectShippingAddress'),
      });
      return false;
    }


    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.contact_person_name) {
      Toast.show({
        type: 'error',
        text1: t('invalidAddress'),
        text2: t('pleaseUpdateAddress'),

      });
      return false;
    }

    return true;
  };

  const handleCheckout = () => {

    if (!validateCheckout()) {
      return;
    }
    (navigation.navigate as any)('CheckoutScreen', {
      cartItems,
      total: getTotal(),
      address: shippingAddress,
    });
  };
  const clearCart = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) { return; }
      const res = await axios.post(
        Base_Url.clearCart,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { guest_id: 1 },
        }
      );
      if (res.data && (res.data === 'Successfully removed' || res.data.message === 'Successfully removed')) {
        setCartItems([]);
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('productRemoved'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: res.data?.message || t('failedproductRemoved'),
        });
      }
    } catch (err: any) {
      if (err.response) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: err.response.data?.message || t('failedproductRemoved'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('failedproductRemoved'),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getTotal = (): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const shippingAddress: Address | null = selectedshippingAddress !== null
    ? selectedshippingAddress
    : addresses.find(addr => addr.address_type?.toLowerCase() === 'home') || null;

  const renderItem = ({ item }: { item: CartItem }) => {
    

    const imageSource = item.thumbnail
      ? `${base_url}/${item.thumbnail}`
      : item.images && item.images.length > 0
        ? item.images[0]
        : IMAGES.imgplaceholder;

    return (
      <View style={styles.cartItemRow}>
        <View style={styles.imageContainer}>
          <Image
          resizeMode='contain'
            source={imageSource ? { uri: imageSource } : IMAGES.imgplaceholder}
            defaultSource={IMAGES.imgplaceholder}
            style={styles.cartImage}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
          />
          {!imageLoaded && imageSource && (
            <Image
              source={IMAGES.imgplaceholder}
              style={[styles.cartImage, styles.placeholderImage]}
            />
          )}
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <CustomText numberOfLines={1} style={styles.cartTitle}>
            {item.name}
          </CustomText>
          <CustomText style={styles.cartPrice}>﷼{item.price.toFixed(2)}</CustomText>
        </View>
        <View style={styles.qtyContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrement')} style={styles.qtyBtn}>
            <CustomText style={styles.qtySymbol}>−</CustomText>
          </TouchableOpacity>
          <CustomText style={styles.qtyText}>{item.quantity}</CustomText>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 'increment')} style={styles.qtyBtn}>
            <CustomText style={styles.qtySymbol}>+</CustomText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.deleteIcon} onPress={() => removeItem(item.id)}>
          <Icon name="delete" size={22} color="#ff4444" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) { return <Loader fullScreen size="large" />; }

  return (
    <SafeAreaView style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <CustomText style={styles.emptyCartText}>{t('noProduct')}</CustomText>
        </View>
      ) : (
        <>
          <Text style={styles.header}>{t('cartheader')}</Text>
          <TouchableOpacity onPress={() => (navigation.navigate as any)('SaveAddress')}>

            <View style={styles.addressContainer}>
              <View style={{ flex: 1 }}>
                <CustomText style={styles.addressLabel}>{t('shippingAddress')}</CustomText>
                {shippingAddress ? (
                  <CustomText style={styles.addressText}>
                    {shippingAddress.contact_person_name}{'\n'}
                    {shippingAddress.address}, {shippingAddress.city} {'\n'}
                    {shippingAddress.zip}
                  </CustomText>
                ) : (
                  <CustomText style={styles.addressText}>{t('noHomeAddress')}</CustomText>
                )}
              </View>
              <TouchableOpacity onPress={() => (navigation.navigate as any)('Address', { address: shippingAddress })}>
                <Icon name="edit" size={20} color="#007bff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>


          <Text style={styles.cartItemCountText}>{t('itemcart')} {getTotalQuantity()}</Text>

          <FlatList data={cartItems} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />

          <Text style={styles.totalText}>
            {t('total')}: ﷼ {getTotal().toFixed(2)}
          </Text>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.checkoutBtn,
              ]}
              onPress={handleCheckout}

            >
              <CustomText
                style={[
                  styles.checkoutText,
                ]}
              >
                {t('checkout')}
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearCartBtn} onPress={clearCart}>
              <CustomText style={styles.clearCartText}>{t('clearCart')}</CustomText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default AddtoCart;
