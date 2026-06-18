import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import { verticalScale } from '../../utils/Metrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import IMAGES from '../../assets/images';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isUserPremium, primeicon } from '../../utils/premimumuser';

import Subscriptionstyle from '../../components/Subscriptionstyle';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.52;

interface Product {
  discount: any;
  thumbnail: any;
  id: number;
  name: string;
  images: string[];
  unit_price: number;
  discount_type: any;
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



interface LatestProductProps {
  searchQuery?: string;
}

const LatestProduct: React.FC<LatestProductProps> = ({ searchQuery = '' }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [icon, setprimeicon] = useState<prime | null>(null);
  const [ispremimum, setispremimum] = useState<boolean>(false);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});
  const primeIcon = async () => {
    const prime = await primeicon();
    setprimeicon(prime.data[0]);
  };

  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
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
      // console.log("res of latest product : ", res.data)
      if (res?.data?.data && res?.data?.data?.products) {
        setAllProducts(res.data.data.products);
        filterProducts(res.data.data.products, searchQuery);
      }
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };

  const filterProducts = (products: Product[], query: string) => {
    if (!query) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const premimumuser = async () => {
    const premimum = await isUserPremium();
    if (premimum) {
      setispremimum(true);
    } else {
      setispremimum(false);
    }
  };

  useEffect(() => {
    filterProducts(allProducts, searchQuery);
  }, [searchQuery, allProducts]);

  useEffect(() => {
    fetchProducts();
    premimumuser();
    primeIcon();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => {
    let imageSource;
    if (item?.thumbnail) {
      imageSource = {
        uri: `${base_url}/${item?.thumbnail}`,
      };
    } else if (item.images && item.images.length) {
      imageSource = {
        uri: `${base_url}/${item.images[0]}`,
      };
    } else {
      imageSource = IMAGES.imgplaceholder;
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
      <TouchableOpacity onPress={() => (navigation.navigate as any)('ProductDetails', { product: { ...item } })}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
  {/* Network image */}
  <Image
    source={imageSource}
    style={styles.productImage}
    resizeMode="contain"
    onLoad={() =>
      setLoadedImages(prev => ({
        ...prev,
        [item.id]: true,
      }))
    }
  />

  {/* Placeholder image: show only if network image NOT loaded yet */}
  {!loadedImages[item.id] && (
    <Image
      source={IMAGES.imgplaceholder}
      style={[styles.productImage, { position: 'absolute' }]}
      resizeMode="contain"
    />
  )}
</View>

          <View style={styles.nameandicon}>
            <Text style={styles.productTitle} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            <View style={styles.primeiconContainer}>
              <Image
                source={{ uri: `${base_url}/${icon?.general_icon?.icon}` }}
                style={styles.primeicon}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.priceContainer}>
            {showDiscountPrice ? (
              <View style={styles.discountContainer}>
                <View style={styles.discountPriceRow}>
                  <Text style={styles.strikethroughPrice}>
                    {price.toFixed(2)} <Text style={styles.currency}>﷼</Text>
                  </Text>
                  <Text style={styles.discountedPrice}>
                    {displayPrice.toFixed(2)} <Text style={styles.currency}>﷼</Text>
                  </Text>
                </View>
              </View>
            ) : showSubscribeMessage ? (
              <View>
                <Text style={styles.originalPrice}>
                  {price.toFixed(2)} <Text style={styles.currency}>﷼</Text>
                </Text>

                <Text style={styles.subscribeMessage}>
                  {t('nonprime')} {discountType === 'flat' ? ` ${discount} ﷼ ` : discount + '%'} off
                </Text>
              </View>
            ) : (
              <Text style={styles.originalPrice}>
                {price.toFixed(2)} <Text style={styles.currency}>﷼</Text>
              </Text>
            )}
          </View>

          {showPrimeUserSection && (
            <Subscriptionstyle />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{t('latestProducts')}</Text>
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => (navigation.navigate as any)('AllLatestProducts', { item: { allProducts } })}
        >
          <Text style={styles.viewAllText}>{t('seeAll')}</Text>
          <VectorIcon
            size={20}
            type="Ionicons"
            name="arrow-forward"
            color={COLORS.appColor || COLORS.text2}
            style={styles.viewAllIcon}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const CARD_HEIGHT = 300;
const IMAGE_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(5),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: COLORS.appColor,
    fontWeight: '600',
    fontSize: 14,
  },
  viewAllIcon: {
    marginLeft: 4,
  },
  flatListContainer: {
    paddingHorizontal: 8,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
    paddingBottom: 12,
    elevation: 2,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
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
    marginBottom: 9,
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
  priceContainer: {
    marginTop: 2,
  },
  discountContainer: {
    alignItems: 'flex-start',
  },
  discountPriceRow: {
    marginHorizontal: 9,
    flexDirection: 'row',
  },
  strikethroughPrice: {
    textDecorationLine: 'line-through',
    color: 'gray',
    fontSize: 15,
    marginRight: 6,
  },
  discountedPrice: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 20,
  },
  originalPrice: {
    color: COLORS.appColor,
    fontWeight: 'bold',
    fontSize: 20,
  },
  subscribeMessage: {
    fontSize: 12,
    color: COLORS.headertext,
    textAlign: 'center',
    marginTop: 2,
  },
  currency: {
    fontWeight: 'normal',
    fontSize: 15,
    color: COLORS.black,
  },

});

export default LatestProduct;
