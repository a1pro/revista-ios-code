import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Url } from '../../utils/ApiUrl';
import IMAGES from '../../assets/images';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import Loader from '../../components/Loader';
import COLORS from '../../utils/Colors';

interface MagazineProduct {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  category_id: number;
  discount: number;
  discount_type: string;
  payment_status: number;
  unit_price: number;
  translations: any[];
  reviews: any[];
}

const MagzineProduct: React.FC = () => {
  const route = useRoute();
  const { categoryId } = route.params as { categoryId: number };
  const [products, setProducts] = useState<MagazineProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `${Base_Url.magzineproduct}?category_id=${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton onPress={() => navigation.goBack()} />
      ),
    });
  }, [navigation]);

  const renderProduct = ({ item }: { item: MagazineProduct }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => (navigation as any).navigate('MagzineProductDetails', { product: item })}
    >
      <Image
        source={item.thumbnail ? { uri: item?.thumbnail } : IMAGES.imgplaceholder}
        style={styles.productImage}
        resizeMode="cover"
      />
      <Text style={styles.productName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loader fullScreen size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {products.length === 0 ? (
        <View style={styles.noProductContainer}>
          <Text style={styles.noProductText}>{('noproduct')}</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
  productName: {
    textAlign: 'center',
    padding: 8,
    fontWeight: 'bold',
    color: COLORS.reviewcmt,
  },
  noProductContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProductText: {
    fontSize: 18,
    color: COLORS.disableText,
  },
});

export default MagzineProduct;
