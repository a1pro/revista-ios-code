/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import BannerSlider from '../../components/BannerSlider';
import styles from './style';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import {  verticalScale } from '../../utils/Metrics';
import IMAGES from '../../assets/images';
import LatestProduct from './LatestProduct';
import TopSeller from './TopSeller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Base_Url } from '../../utils/ApiUrl';
import axios from 'axios';
import Loader from '../../components/Loader';
import BrandedProducts from '../BrandedProduct/BrandedProducts';
import CategorySection from '../CategorySection/CategorySection';
import CategorySection2 from '../CategorySection/CategorySection2';
import { t } from 'i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
};

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        setCartItems([]);
        return;
      }

      const res = await axios.get(Base_Url.getcart, {
        headers: { Authorization: `Bearer ${token}` },
        params: { guest_id: 1 },
      });
      setCartItems(Array.isArray(res?.data) ? res?.data : []);
    } catch (err) {
      console.log('Error fetching cart:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshHomeData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);


  useFocusEffect(
    useCallback(() => {
      refreshHomeData();
      fetchCart();
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        subscription.remove();
      };
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Loader size="large" fullScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { 
    }]}>
      <ScrollView >
        <View style={{ paddingBottom: verticalScale(20) }}>
          <View style={styles.headerContainer}>
            <View style={styles.leftIcons}>
              <TouchableOpacity onPress={() => navigation.navigate('AddtoCart')}>
                <View>
                  <VectorIcon
                    size={28}
                    type="Feather"
                    name="shopping-cart"
                    color="#555"
                  />
                  {cartItems.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{cartItems.length}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowSearch((prev) => !prev);
                  if (!showSearch) {setSearchQuery('');}
                }}
              >
                <VectorIcon
                  size={32}
                  type="Feather"
                  name="search"
                  color="#555"
                  style={{ marginLeft: 18 }}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.revistaText}>{'Revista'}</Text>

            <View style={styles.rightBrand}>
              <Image
                source={IMAGES.revista22}
                style={styles.logoImg}
                resizeMode="contain"
              />
            </View>
          </View>

          {showSearch && (
            <View style={styles.searchBarContainer}>
              <VectorIcon
                size={20}
                type="Feather"
                name="search"
                color={COLORS.placeholder || COLORS.review}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                placeholderTextColor={COLORS.placeholder || COLORS.review}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
          )}
          {searchQuery ? (
            <LatestProduct searchQuery={searchQuery} />
          ) : (
            <>
              <BannerSlider />
              <CategorySection navigation={navigation as any} route={{} as any}/>
              <BannerSlider />

              {/* <FlashSale /> */}
              <TopSeller navigation={navigation as any} route={{} as any} />

              <CategorySection2 navigation={navigation as any} route={{} as any}/>
              <BrandedProducts/>
              {/* <HandmadeProducts /> */}

              <LatestProduct searchQuery={searchQuery} />
            </>
          )}



        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
