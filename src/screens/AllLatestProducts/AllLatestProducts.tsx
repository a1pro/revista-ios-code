/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import IMAGES from '../../assets/images';
import VectorIcon from '../../components/VectorIcon';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import COLORS from '../../utils/Colors';
import { verticalScale } from '../../utils/Metrics';
import { useTranslation } from 'react-i18next';
import { isUserPremium, primeicon } from '../../utils/premimumuser';
import Subscriptionstyle from '../../components/Subscriptionstyle';
import Loader from '../../components/Loader';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2;

interface Product {
  discount: any;
  thumbnail: any;
  id: number;
  name: string;
  images: string[];
  unit_price: number;
  discount_type: any
}
interface prime {
  id: number;
  general_icon: {
    icon: string;
    title: string;
  };
  prime_icon: {
    icon: string;
    title: string;
  };
}
const IMAGE_SIZE = 85;

const AllLatestProducts: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ispremimum, setispremimum] = useState<boolean>(false);
  const [icon, setprimeicon] = useState<prime | null>(null);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const primeIcon = async () => {
    const prime = await primeicon();
    setprimeicon(prime.data[0]);
  };
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      const res = await axios.get(Base_Url.latestpro, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          guest_id: 1,
        },
      });


      if (res?.data?.data && res?.data?.data?.products) {
        setAllProducts(res?.data?.data?.products);
      }
    } catch (error) {
      console.log('Error fetching products:', error);
    }
    setLoading(false);
  };
  const premimumuser = async () => {
    const premimum = await isUserPremium();

    if (premimum) {


      setispremimum(true);

    } else {
      setispremimum(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );
  useEffect(() => {

    premimumuser();
    primeIcon();
  }, []);
  const renderProduct = ({ item }: { item: Product }) => {
    let imageSource;

    if (item?.thumbnail) {
      imageSource = { uri: `${base_url}/${item.thumbnail}` };
    } else{
      imageSource = { uri: `${base_url}/${item.images[0]}` };
    }
    const price = Number(item.unit_price) || 0;
    const discount = Number(item.discount) || 0;
    const discountType = item?.discount_type || 'percent';
    let displayPrice = price;
    let showDiscountPrice = false;
    if (ispremimum && discount > 0) {
      if (discountType === 'flat') {
        displayPrice = price - discount;
      } else if (discountType === 'percent') {
        displayPrice = price - (price * discount) / 100;
      }
      showDiscountPrice = true;
    }
    const showSubscribeMessage = !ispremimum && discount > 0;
     const showPrimeUserSection = ispremimum;
    return (
      <TouchableOpacity
        onPress={() =>
          (navigation as any ).navigate('ProductDetails', { product: item })
        }
        style={styles.cardContainer}
      >
        <View style={styles.card}>
          <Image
            source={imageSource}
            style={styles.productImage}
            resizeMode="contain"
          />
          <View style={styles.nameandicon}>
            <Text style={styles.productTitle} numberOfLines={1} ellipsizeMode="tail">{item?.name}</Text>

            <View style={styles.primeiconContainer}>
              <Image
                source={{ uri: `${base_url}/${icon?.general_icon?.icon}` }}
                style={styles.primeicon}
                resizeMode="contain"
              />
            </View>

          </View>
          <View style={{ marginTop: 2 }}>
            {showDiscountPrice ? (
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.price, { color: 'green', fontWeight: 'bold', fontSize: 20 }]}>
                  {displayPrice.toFixed(2)} <Text style={styles.currency}>﷼</Text>
                </Text>
                <View style={{ marginHorizontal: 9, flexDirection: 'row' }}>
                  <Text
                    style={{
                      textDecorationLine: 'line-through',
                      color: 'gray',
                      fontSize: 15,
                    }}
                  >
                    {price.toFixed(2)} <Text style={styles.currency}>﷼</Text>
                  </Text>
                  <Text style={{ marginLeft: 6, color: '#e63946', fontWeight: 'bold' }}>
                    ({discountType === 'flat' ? discount : discount + '%'} OFF)
                  </Text>
                </View>
              </View>
            ) : showSubscribeMessage ? (
              <View>
                <Text style={[styles.price, {
                  color: COLORS.appColor,
                  fontWeight: 'bold',
                  fontSize: 20,
                }]}>
                  {price.toFixed(2)} <Text style={styles.currency}>﷼</Text>
                </Text>

                <Text style={{
                  fontSize: 12,
                  color: COLORS.headertext,
                  textAlign: 'center',
                  marginTop: 2,
                }}>
                 {t('nonprime')} {discountType === 'flat' ? ` ${discount} ﷼ ` : discount + '%'} off
                </Text>
              </View>
            ) : (

              <Text style={[styles.price, {
                color: COLORS.appColor,
                fontWeight: 'bold',
                fontSize: 20,
              }]}>
                {price.toFixed(2)} <Text style={styles.currency}>﷼</Text>
              </Text>
            )}
          </View>
           {showPrimeUserSection && (
            <Subscriptionstyle/>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Loader size="large"  />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <VectorIcon
            type="Ionicons"
            name="arrow-back"
            size={26}
            color={COLORS.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t('allLatestProducts') || 'All Latest Products'}
        </Text>
        {/* Just a placeholder for spacing */}
        <View style={{ width: 26 }} />
      </View>
      <FlatList
        data={allProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: verticalScale(10),
          paddingBottom: verticalScale(20),
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', width: width - 32 }}>
            {t('noProductsFound') || 'No products found.'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7fbff',
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    elevation: 2,
    marginBottom: 4,
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1,
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
  },
  cardContainer: {
    marginBottom: 18,
    width: CARD_WIDTH,
  },
  card: {
    width: '100%',
    // height: CARD_HEIGHT,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
    paddingBottom: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // overflow: 'hidden',
  },
  nameandicon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primeiconContainer: {
    height: 20,
    width: 30,
  },
  primeicon: {
    borderRadius: 100,
    height: 25,
    width: 25,
  },
  price: {
    // fontSize: 0.2,
    fontWeight: 'bold',
    color: COLORS.appColor,
    marginBottom: 10,
    textAlign: 'center',
  },
  productImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginTop: 12,
    marginBottom: 10,
    zIndex: 1,
  },
  productTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: COLORS.black,
    marginTop: 8,
    textAlign: 'center',
    width: '70%',
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.appColor,
    marginTop: 6,
    textAlign: 'center',
  },
  currency: {
    fontWeight: 'normal',
    fontSize: 15,
    color: COLORS.black || COLORS.review,
  },
});

export default AllLatestProducts;
