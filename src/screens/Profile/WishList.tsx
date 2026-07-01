/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-catch-shadow */
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { CustomText } from '../../components/CustomText';
import COLORS from '../../utils/Colors';
import { verticalScale } from '../../utils/Metrics';
import { useDispatch } from 'react-redux';
import { addCartItem } from '../../redux/slice/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import { removeFavourite } from '../../redux/slice/favouriteSlice';
import VectorIcon from '../../components/VectorIcon';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';
import IMAGES from '../../assets/images';

type Props = NativeStackScreenProps<RootStackParamList, 'WishList'>;

interface WishlistItem {
  id: number;
  product_id: number;
  product_full_info: {
    id: number;
    name: string;
    unit_price: number;
    images: string;
    thumbnail: string;
    details?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

const WishList: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState<number | null>(null);
  const [clearLoading, setClearLoading] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }
      const response = await axios.get(Base_Url.getWishlist, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlistItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch wishlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      setCartLoading(item.id);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('noToken'),
        });
        setCartLoading(null);
        return;
      }
      const formData = new FormData();
      formData.append('id', item.product_full_info.id.toString());
      formData.append('quantity', '1');
      const res = await axios.post(Base_Url.addtocart, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (res.data && res.data.message === 'Successfully added!') {
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: res.data.message || t('addtocart'),
        });
        dispatch(
          addCartItem({
            id: item.product_full_info.id.toString(),
            name: item.product_full_info.name,
            price: item.product_full_info.unit_price,
            image: item.product_full_info.thumbnail,
            quantity: 1,
          }),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message || t('failCart'),
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error?.response?.data?.message || t('erroraddingcart'),
      });

    } finally {
      setCartLoading(null);
    }
  };

  const handleRemoveFromWishlist = async (item: WishlistItem) => {

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('noToken'),
        });

        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('product_id', item.product_full_info.id.toString());
      const res = await axios.post(Base_Url.wishlistremove, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data && res.data.message === 'Successfully removed!') {

        setWishlistItems(prev =>
          prev.filter(i => i.product_id !== item.product_full_info.id),
        );
        dispatch(removeFavourite({ id: item.product_full_info.id }));
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('removefromfav'),
        });
      } else {


        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data?.message || t('fail2'),
        });

      }

    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: error?.response?.data?.message ||
          t('fail2'),
      });

    } finally {
      setLoading(false);
    }
  };

  const handleClearWishlist = async () => {
    try {
      setClearLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('noToken'),
        });
        setClearLoading(false);
        return;
      }
      const res = await axios.post(
        Base_Url.clearWishlist,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (
        res.data && res.data.message === 'Successfully removed all wishlist items!'
      ) {
        setWishlistItems([]);
        dispatch({ type: 'favourite/clearAll' });
        Toast.show({
          type: 'success',
          text1: t('success'),
          text2: t('clearWishlist'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: res.data?.message || t('failClear'),
        });
      }
    } catch (err: any) {
      console.error('Clear wishlist error:', err);
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: err?.response?.data?.message || t('failClear'),
      });

    } finally {
      setClearLoading(false);
    }
  };
  
  const getFirstImage = (images: string) => {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
    } catch (e) {
      return images;
    }
    return images;
  };

  const renderItem = ({ item }: { item: WishlistItem }) => {
    const imageName = getFirstImage(item.product_full_info.thumbnail);
    const imagePath = imageName || item.product_full_info.thumbnail;
    const imageUrl = imagePath
     ? imagePath.startsWith('http')
     ? imagePath
     :imagePath.startsWith('storage')
     ?`${base_url}/${imagePath}`
     :`${base_url}/storage/app/public/product/thumbnail/${imagePath}`
     :IMAGES.imgplaceholder

    return (
      <View style={styles.itemRow}>
        <Image source={{ uri: imageUrl }} style={styles.itemImage} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <CustomText style={styles.itemName}>
            {item.product_full_info.name}
          </CustomText>
          <CustomText style={styles.itemDesc}>
            {item.product_full_info.details
              ? item.product_full_info.details.replace(/<[^>]*>/g, '')
              : 'No description available'}
          </CustomText>
          <CustomText fontWeight="bold" style={styles.itemPrice}>
            ${item.product_full_info.unit_price?.toFixed(2)}
          </CustomText>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => handleAddToCart(item)}
            disabled={cartLoading === item.id}>
            {cartLoading === item.id ? (
              <Loader size="small" />
            ) : (
              <CustomText color="#fff" fontWeight="bold" style={{ fontSize: 13 }}>
                {t('cart')}
              </CustomText>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemoveFromWishlist(item)}
          disabled={clearLoading}>
          <Icon name="delete" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loader fullScreen size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomText style={styles.errorText}>{error}</CustomText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
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
          style={styles.header}>
          {t('wishlist')}
        </CustomText>

        <FlatList
          data={wishlistItems}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={renderItem}
          ListEmptyComponent={
            <CustomText style={styles.emptyText}>
              {t('failtoclear')}
            </CustomText>
          }
        />

        {wishlistItems.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearWishlist}
            disabled={clearLoading}>
            {clearLoading ? (
              <Loader size="small" />
            ) : (
              <CustomText color="#fff" fontWeight="bold">
                {t('clear')}
              </CustomText>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  innerContainer: { flex: 1, paddingHorizontal: 10, paddingTop: 10 },
  backButton: {
    position: 'absolute',
    left: 20,
    top: verticalScale(25),
    zIndex: 1,
    padding: 8,
  },
  header: {
    fontSize: 22,
    marginBottom: 8,
    textAlign: 'center',
    marginTop: verticalScale(16),
    marginLeft: 36,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    marginBottom: 16,
    padding: 10,
    position: 'relative',
  },
  itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 6 },
  itemName: { fontSize: 14, color: COLORS.textColor, marginBottom: 2 },
  itemDesc: { fontSize: 12, color: COLORS.review, marginBottom: 4 },
  itemPrice: { fontSize: 16, color: COLORS.textColor, marginBottom: 6 },
  addToCartBtn: {
    backgroundColor: COLORS.btnbg,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 7,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  removeBtn: {
    position: 'absolute',
    right: 8,
    top: 8,
    padding: 4,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.review,
  },
  clearBtn: {
    backgroundColor: COLORS.btnbg,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },
});

export default WishList;
