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
import VectorIcon from '../../components/VectorIcon';
import { verticalScale } from '../../utils/Metrics';
import COLORS from '../../utils/Colors';
import IMAGES from '../../assets/images';
import { useTranslation } from 'react-i18next';
import { Base_Url } from '../../utils/ApiUrl';
import Loader from '../../components/Loader';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

const { width } = Dimensions.get('window');

const HandmadeProducts: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
          text1: t('error') || 'Error',
          text2: t('noToken') || 'No token found',
        });
        setError(t('noToken') || 'No token found');
        setLoading(false);
        return;
      }

      const res = await axios.get(Base_Url.handmade, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
            params: {
        guest_id: 1,
      },
      });

      if (res.data && res.data.products) {
        const mappedProducts = res.data.products.map((item: any) => ({
          id: item.id?.toString() || '',
          name: item.name || '',
          price: item.unit_price ? `${item.unit_price} SAR` : 'N/A',
          image: item.thumbnail_url || '',
        }));
        setProducts(mappedProducts);
      } else {
        setProducts([]);
      }
    } catch (e: any) {
      setError(t('errorFetchingProducts') || 'Error fetching products');
      Toast.show({
        type: 'error',
        text1: t('error') || 'Error',
        text2: t('errorFetchingProducts') || 'Error fetching products',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.itemContainer}>
      <Image
        source={
          // item.image
            { uri: item?.image }
        }
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </View>
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
        <Text style={styles.title}>{t('handmade')}</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>{t('seeAll')}</Text>
          <VectorIcon
            size={30}
            type="Ionicons"
            name="arrow-forward-circle"
            color={COLORS.black}
            style={{ marginLeft: verticalScale(10) }}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
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
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    backgroundColor: '#eee',
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

export default HandmadeProducts;
