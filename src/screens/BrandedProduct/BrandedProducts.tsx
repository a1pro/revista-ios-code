/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { verticalScale } from '../../utils/Metrics';
import COLORS from '../../utils/Colors';
import IMAGES from '../../assets/images';
import { useTranslation } from 'react-i18next';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../components/Loader';





interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}
const { width } = Dimensions.get('window');

const BrandedProducts: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: t('noToken'),
        });
        setError(t('noToken'));
        setLoading(false);
        return;
      }

      const res = await axios.get(Base_Url.brandedproduct, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          guest_id: 1,
        },
      });
      // console.log(res.data)
      if (res?.data?.data) {

        setProducts(res.data.data);
      } else {
        setProducts([]);
      }
    } catch (e: any) {
      setError(t('errorFetchingProducts'));
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('errorFetchingProducts'),
      });
    } finally {
      setLoading(false);
    }
  };


  const renderItem = ({ item }: { item: Product }) => (

    <TouchableOpacity
      onPress={() => (navigation.navigate as any)('BrandedProductSubCategories', { category: item })}
    >
      <View style={styles.itemContainer}>

        <View style={styles.imageWrapper}>
          {/* Placeholder */}
          {!loadedImages[item.id] && (
            <Image
              source={IMAGES.imgplaceholder}
              style={[styles.image, { position: 'absolute' }]}
              resizeMode="contain"
            />
          )}

          {/* Actual image */}
          <Image
            source={{ uri: `${base_url}/${item?.image}` }}
            style={styles.image}
            resizeMode="contain"
            onLoad={() =>
              setLoadedImages(prev => ({
                ...prev,
                [item.id]: true,
              }))
            }
            onError={() =>
              setLoadedImages(prev => ({
                ...prev,
                [item.id]: false,
              }))
            }
          />
        </View>
        <Text style={styles.name}>{item.name}</Text>

      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Loader size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('BrandedProduct')}</Text>

      </View>

      <FlatList
        data={products}

        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', width: width - 32 }}>
            {t('noProductsFound')}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    marginTop: verticalScale(20),
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: COLORS.text2,
    fontSize: 14,
    marginRight: 4,
  },
  itemContainer: {
    width: 100,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  imageWrapper: {
  width: 70,
  height: 70,
  borderRadius: 35,
  marginBottom: 8,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: COLORS.white,
},
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
  },
  price: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
});

export default BrandedProducts;
