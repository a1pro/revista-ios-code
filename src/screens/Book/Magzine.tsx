
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Base_Url } from '../../utils/ApiUrl';
import IMAGES from '../../assets/images';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../utils/Colors';
import Loader from '../../components/Loader';
import { t } from 'i18next';

interface Category {
  id: number;
  name: string;
}

interface ProductItem {
  id: number;
  thumbnail: any;
  productData?: any;
}

interface MasonryItem extends ProductItem {
  height: number;
}

const { width } = Dimensions.get('window');
const GAP = 8;
const COLUMN_WIDTH = (width - GAP * 3) / 2;

const generateMasonryColumns = (data: ProductItem[] = []): [MasonryItem[], MasonryItem[]] => {
  const left: MasonryItem[] = [];
  const right: MasonryItem[] = [];

  let rowIndex = 0;

  for (let i = 0; i < data.length; i += 3) {
    const isEvenRow = rowIndex % 2 === 0;

    const formattedItem1 = {
      id: data[i].id,
      thumbnail:
        typeof data[i].thumbnail === 'string'
          ? { uri: data[i].thumbnail }
          : data[i].thumbnail,
      productData: data[i].productData,
    };

    if (i + 1 < data.length && i + 2 < data.length) {
      if (isEvenRow) {
        left.push({ ...formattedItem1, height: 250 });

        const formattedItem2 = {
          id: data[i + 1].id,
          thumbnail:
            typeof data[i + 1].thumbnail === 'string'
              ? { uri: data[i + 1].thumbnail }
              : data[i + 1].thumbnail,
          productData: data[i + 1].productData, // Fixed: Added productData
        };
        right.push({ ...formattedItem2, height: 125 });

        const formattedItem3 = {
          id: data[i + 2].id,
          thumbnail:
            typeof data[i + 2].thumbnail === 'string'
              ? { uri: data[i + 2].thumbnail }
              : data[i + 2].thumbnail,
          productData: data[i + 2].productData, // Fixed: Added productData
        };
        right.push({ ...formattedItem3, height: 125 });
      } else {
        right.push({ ...formattedItem1, height: 250 });

        const formattedItem2 = {
          id: data[i + 1].id,
          thumbnail: typeof data[i + 1].thumbnail === 'string'
            ? { uri: data[i + 1].thumbnail }
            : data[i + 1].thumbnail,
          productData: data[i + 1].productData, // Fixed: Added productData
        };
        left.push({ ...formattedItem2, height: 125 });

        const formattedItem3 = {
          id: data[i + 2].id,
          thumbnail: typeof data[i + 2].thumbnail === 'string'
            ? { uri: data[i + 2].thumbnail }
            : data[i + 2].thumbnail,
          productData: data[i + 2].productData, // Fixed: Added productData
        };
        left.push({ ...formattedItem3, height: 125 });
      }
    } else if (i + 1 < data.length) {
      if (isEvenRow) {
        left.push({ ...formattedItem1, height: 250 });
        const formattedItem2 = {
          id: data[i + 1].id,
          thumbnail: typeof data[i + 1].thumbnail === 'string'
            ? { uri: data[i + 1].thumbnail }
            : data[i + 1].thumbnail,
          productData: data[i + 1].productData, // Fixed: Added productData
        };
        right.push({ ...formattedItem2, height: 125 });
      } else {
        right.push({ ...formattedItem1, height: 250 });
        const formattedItem2 = {
          id: data[i + 1].id,
          thumbnail: typeof data[i + 1].thumbnail === 'string'
            ? { uri: data[i + 1].thumbnail }
            : data[i + 1].thumbnail,
          productData: data[i + 1].productData, // Fixed: Added productData
        };
        left.push({ ...formattedItem2, height: 125 });
      }
    } else {
      if (isEvenRow) {
        left.push({ ...formattedItem1, height: 250 });
      } else {
        right.push({ ...formattedItem1, height: 250 });
      }
    }

    rowIndex++;
  }

  return [left, right];
};

const Magzine = ({ navigation }: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  console.log(products);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(Base_Url.magzinecategory, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('res of magzine category::: ',response)
        setCategories(response.data);
        setFilteredCategories(response.data);

        if (response.data.length > 0) {
          setSelectedCategoryId(response.data[0].id);
        }
      } catch (error) {
        console.error('Category Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(
          `${Base_Url.magzineproduct}?category_id=${selectedCategoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
console.log('res of magzine product::::', response)
        const items: ProductItem[] = (response.data.products || []).map(
          (item: any) => ({
            id: item.id,
            thumbnail: item?.thumbnail
              ? { uri: item.thumbnail }
              : IMAGES.imgplaceholder,
            productData: item,
          }),
        );

        setProducts(items);
      } catch (error) {
        console.error('Product Error:', error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredCategories(filtered);
    setSelectedCategoryId(filtered.length ? filtered[0].id : null);
  }, [searchQuery, categories]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Loader fullScreen size="large" />
      </SafeAreaView>
    );
  }

  const [leftCol, rightCol] = generateMasonryColumns(products);

  const handleProductPress = (productData: any) => {
    if (productData) {
      navigation.navigate('ProductDetails', {
        product: productData,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchBar}
          placeholder={t('searchctegory')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.placeholder}
        />

        <Image source={IMAGES.revista22} style={styles.revistaIcon} />
      </View>

      <View style={styles.categoryListContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredCategories.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedCategoryId(item.id)}
              style={[
                styles.categoryButton,
                selectedCategoryId === item.id &&
                styles.activeCategoryButton,
              ]}>
              <Text style={styles.categoryButtonText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loadingProducts ? (
        <View style={styles.loadingContainer}>
          <Loader size="medium" />
        </View>
      ) : products.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <Text style={{ color: COLORS.textColor, fontSize: 16 }}>{t('noProductsFound')}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.masonryContainer}>
          <View style={styles.masonryColumn}>
            {leftCol.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() => handleProductPress(item.productData)}>
                <Image
                  source={item.thumbnail}
                  style={[styles.masonryImage, { height: item.height }]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.masonryColumn}>
            {rightCol.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() => handleProductPress(item.productData)}>
                <Image
                  source={item.thumbnail}
                  style={[styles.masonryImage, { height: item.height }]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Magzine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    backgroundColor: COLORS.backgroundColor,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    fontSize: 16,
    marginRight: 10,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.bordercolor1,
  },
  revistaIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  categoryListContainer: {
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: COLORS.revista,
    borderRadius: 12,
    height: 36,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: COLORS.revista2,
  },
  categoryButtonText: {
    color: COLORS.white,
    fontSize: 14,
  },
  masonryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  masonryColumn: {
    flex: 1,
    marginHorizontal: GAP / 2,
  },
  masonryImage: {
    width: COLUMN_WIDTH,
    marginBottom: GAP,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
