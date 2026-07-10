
import React, { useState, useEffect, useCallback } from 'react';
import {
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
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

interface Category {
  id: number;
  name: string;
  translations?: any[];
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

// Category translation mapping
const categoryTranslations: { [key: string]: { en: string; ar: string } } = {
  'Sport': { en: 'Sport', ar: 'رياضة' },
  'Sports': { en: 'Sports', ar: 'الرياضة' },
  'Science': { en: 'Science', ar: 'العلوم' },
  'Travel': { en: 'Travel', ar: 'السفر' },
  'dammam restront': { en: 'Dammam Restaurant', ar: 'مطعم الدمام' },
  'Dammam Restaurant': { en: 'Dammam Restaurant', ar: 'مطعم الدمام' },
};

const getTranslatedCategoryName = (categoryName: string, currentLanguage: string): string => {
  // Check if we have a translation mapping for this category
  const translation = categoryTranslations[categoryName];

  if (translation) {
    return currentLanguage === 'sa' ? translation.ar : translation.en;
  }

  // If no translation mapping exists, return the original name
  return categoryName;
};

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
          productData: data[i + 1].productData,
        };
        right.push({ ...formattedItem2, height: 125 });

        const formattedItem3 = {
          id: data[i + 2].id,
          thumbnail:
            typeof data[i + 2].thumbnail === 'string'
              ? { uri: data[i + 2].thumbnail }
              : data[i + 2].thumbnail,
          productData: data[i + 2].productData,
        };
        right.push({ ...formattedItem3, height: 125 });
      } else {
        right.push({ ...formattedItem1, height: 250 });

        const formattedItem2 = {
          id: data[i + 1].id,
          thumbnail: typeof data[i + 1].thumbnail === 'string'
            ? { uri: data[i + 1].thumbnail }
            : data[i + 1].thumbnail,
          productData: data[i + 1].productData,
        };
        left.push({ ...formattedItem2, height: 125 });

        const formattedItem3 = {
          id: data[i + 2].id,
          thumbnail: typeof data[i + 2].thumbnail === 'string'
            ? { uri: data[i + 2].thumbnail }
            : data[i + 2].thumbnail,
          productData: data[i + 2].productData,
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
          productData: data[i + 1].productData,
        };
        right.push({ ...formattedItem2, height: 125 });
      } else {
        right.push({ ...formattedItem1, height: 250 });
        const formattedItem2 = {
          id: data[i + 1].id,
          thumbnail: typeof data[i + 1].thumbnail === 'string'
            ? { uri: data[i + 1].thumbnail }
            : data[i + 1].thumbnail,
          productData: data[i + 1].productData,
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
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  // Function to get translated category name
  // const getTranslatedName = (categoryName: string): string => {
  //   const currentLanguage = i18n.language || 'en';
  //   const langCode = currentLanguage === 'sa' ? 'sa' : 'en';

  //   // Check if category has translations array from API
  //   const category = categories.find(cat => cat.name === categoryName);
  //   if (category?.translations && category.translations.length > 0) {
  //     // Try to find translation for current language
  //     const translation = category.translations.find(
  //       (t: any) => t.locale === langCode
  //     );
  //     if (translation) {
  //       return translation.name || categoryName;
  //     }
  //   }

  //   // Fallback to local translation mapping
  //   return getTranslatedCategoryName(categoryName, langCode);
  // };





  // useEffect(() => {
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const lang = (await AsyncStorage.getItem('language')) || 'sa';

      console.log('Language:', lang);

      const headers = {
        Authorization: `Bearer ${token}`,
        'Accept-Language': lang,
      };
      console.log('headers:',);

      console.log('Headers:', headers);

      const response = await axios.get(Base_Url.magzinecategory, {
        headers,
      });

      console.log('Categoriessssssssssssss:', response);

      setCategories(response.data);
      setFilteredCategories(response.data);

      if (response.data?.length > 0) {
        setSelectedCategoryId(response.data[0].id);
      }
    } catch (error: any) {
      console.log(
        'Category Error:',
        error.response?.data || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);


  // }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();

      return () => { };
    }, [fetchCategories])
  );

  // Re-filter categories when language changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = categories.filter((category) => {
        const translatedName = getTranslatedCategoryName(
          category.name,
          i18n.language === 'sa' ? 'sa' : 'en'
        );
        return translatedName.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredCategories(filtered);
      if (filtered.length > 0) {
        setSelectedCategoryId(filtered[0].id);
      }
    } else {
      setFilteredCategories(categories);
    }
  }, [i18n.language, categories]);

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

    const filtered = categories.filter((category) => {
      const translatedName = getTranslatedCategoryName(
        category.name,
        i18n.language === 'sa' ? 'sa' : 'en'
      );
      return translatedName.toLowerCase().includes(searchQuery.toLowerCase());
    });

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

  // Get translated category name for display
  const getDisplayCategoryName = (category: Category): string => {
    const currentLanguage = i18n.language || 'en';
    const langCode = currentLanguage === 'sa' ? 'sa' : 'en';

    // Check if category has translations array from API
    if (category.translations && category.translations.length > 0) {
      const translation = category.translations.find(
        (t: any) => t.locale === langCode
      );
      if (translation && translation.name) {
        return translation.name;
      }
    }

    // Fallback to local translation mapping
    return getTranslatedCategoryName(category.name, langCode);
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
              <Text style={styles.categoryButtonText}>
                {getDisplayCategoryName(item)}
              </Text>
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