
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import axios from 'axios';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import COLORS from '../../utils/Colors';
import IMAGES from '../../assets/images';
import { isUserPremium } from '../../utils/premimumuser';

type SubCategory = {
  id: number;
  title: string;
  image: string;
  is_membership?: number;
};

export type Category = {
  defaultname: string;
  id: number;
  title: string;
  image: string;
  price: string;
  is_membership?: number;
  subCategories: SubCategory[];
};

type Props = NativeStackScreenProps<RootStackParamList, 'AllCategories'>;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CategorySection: React.FC<Props> = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  // Check premium status
  const checkPremiumStatus = useCallback(async () => {
    try {
      const premium = await isUserPremium();
      setIsPremium(premium);
      return premium;
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
      return false;
    }
  }, []);

  // Filter categories based on premium status
  const filterCategoriesByPremium = useCallback((categoriesData: any[], isPremiumUser: boolean): any[] => {
    if (!categoriesData || categoriesData.length === 0) return [];
    
    if (isPremiumUser) {
      
      return categoriesData;
    } else {
     
      return categoriesData.filter(category => category.is_membership === 0);
    }
  }, []);

  const filterSubCategories = useCallback((subCategories: any[], isPremiumUser: boolean): any[] => {
    if (!subCategories || subCategories.length === 0) return [];
    
    if (isPremiumUser) {
      return subCategories;
    } else {
      return subCategories.filter(sub => sub.is_membership === 0);
    }
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const premiumStatus = await checkPremiumStatus();
      
      const res = await axios.get(Base_Url.allcategory);
      if (res?.data && Array.isArray(res.data)) {
        // Log categories breakdown
        const premiumCategories = res.data.filter((cat: any) => cat.is_membership === 1);
        const freeCategories = res.data.filter((cat: any) => cat.is_membership === 0);
      

        const filteredCategories = filterCategoriesByPremium(res.data, premiumStatus);

        const mappedCategories: Category[] = filteredCategories.map((cat: any) => ({
          id: cat.id,
          title: cat.name,
          image: cat.icon,
          is_membership: cat.is_membership || 0,
          subCategories: filterSubCategories(cat.childes || [], premiumStatus).map((sub: any) => ({
            id: sub.id,
            title: sub.name,
            image: sub.icon,
            is_membership: sub.is_membership || 0,
            products: sub.products || [],
            childes: sub.childes || [],
          })),
        }));
        
        setCategories(mappedCategories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.card, !isPremium && item.is_membership === 1 && styles.premiumCard]}
      onPress={() => {
        if (!isPremium && item.is_membership === 1) {
         
          return;
        }
        navigation.navigate('SubCategories', { category: item });
      }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={IMAGES.imgplaceholder}
          style={styles.image}
        />

        {!loadedImages[item.id] && (
          <ActivityIndicator
            size="small"
            color={COLORS.black}
            style={styles.loader}
          />
        )}

        <Image
          source={{ uri: `${base_url}/${item.image}` }}
          style={[
            styles.image,
            {
              position: 'absolute',
              opacity: loadedImages[item.id] ? 1 : 0,
            },
          ]}
          onLoad={() =>
            setLoadedImages(prev => ({
              ...prev,
              [item.id]: true,
            }))
          }
        />
      </View>
      <Text style={styles.title} numberOfLines={1}>{item?.title}</Text>
      
      {/* Show premium badge for premium categories when user is not premium */}
      {!isPremium && item.is_membership === 1 && (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumBadgeText}>Premium</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.black} />
        </View>
      </SafeAreaView>
    );
  }

  // For premium users, show all categories (up to 14)
  // For non-premium users, show only free categories (limited to first 14)
  const displayCategories = categories.slice(0, 14);
  const firstRow = displayCategories.slice(0, 7);
  const secondRow = displayCategories.slice(7, 14);

  // If no categories to show
  if (displayCategories.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>{t('allCategories')}</Text>
          <TouchableOpacity style={styles.seeAllRow} onPress={() => navigation.navigate('AllCategories')}>
            <Text style={styles.seeAll}>{t('seeAll')}</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{t('allCategories')}</Text>
        <TouchableOpacity style={styles.seeAllRow} onPress={() => navigation.navigate('AllCategories')}>
          <Text style={styles.seeAll}>{t('seeAll')}</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
      
      {/* Show premium upgrade info for non-premium users */}
      {!isPremium && categories.some(cat => cat.is_membership === 1) && (
        <View style={styles.premiumInfoContainer}>
          <Text style={styles.premiumInfoText}>
            Upgrade to Premium to see all categories
          </Text>
        </View>
      )}
      
      {firstRow.length > 0 && (
        <FlatList
          data={firstRow}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}
      
      {secondRow.length > 0 && (
        <FlatList
          data={secondRow}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: COLORS.white, 
    paddingVertical: 12 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.redblack,
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 16,
    color: COLORS.btnbg,
    marginRight: 4,
  },
  arrow: {
    fontSize: 18,
    color: COLORS.btnbg,
  },
  flatListContent: {
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    width: 90,
    paddingVertical: 8,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    position: 'relative',
  },
  premiumCard: {
    opacity: 0.7,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#eee',
  },
  imageContainer: {
    width: 64,
    height: 64,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    zIndex: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.reviewcmt,
    textAlign: 'center',
    marginBottom: 2,
  },
  price: {
    fontSize: 12,
    color: COLORS.review,
    textAlign: 'center',
  },
  premiumBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.blue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumBadgeText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  premiumInfoContainer: {
    backgroundColor: COLORS.placeholder,
    padding: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  premiumInfoText: {
    fontSize: 12,
    color: COLORS.textColor,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.disableText,
  },
});

export default CategorySection;