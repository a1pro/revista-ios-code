import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { horizontalScale, verticalScale } from '../../utils/Metrics';
import axios from 'axios';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import Loader from '../../components/Loader';
import { t } from 'i18next';
import COLORS from '../../utils/Colors';
import IMAGES from '../../assets/images';
import { CustomText } from '../../components/CustomText';
import { isUserPremium } from '../../utils/premimumuser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Category = {
  id: number;
  name: string;
  title: string;
  image: string;
  icon: string;
  defaultname?: string;
  is_membership?: number;
  subCategories?: SubCategory[];
  childes?: SubCategory[];
};

type SubCategory = {
  id: number;
  name: string;
  title: string;
  image: string;
  icon: string;
  is_membership?: number;
  products?: any[];
  childes?: SubCategory[];
};

type Props = NativeStackScreenProps<RootStackParamList, 'AllCategories'>;

const ITEM_WIDTH = Dimensions.get('window').width / 3 - 24;

const AllCategories: React.FC<Props> = ({ navigation }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [handmadecategories, setHandmadeCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});
  const [isPremium, setIsPremium] = useState<boolean>(false);

  // Function to check premium status - always fetch fresh
  const checkPremiumStatus = useCallback(async () => {
    try {
      // Clear any cached premium status
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsPremium(false);
        return false;
      }
      
      const premium = await isUserPremium();
      setIsPremium(premium);
      return premium;
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
      return false;
    }
  }, []);

  const filterCategoriesByPremium = useCallback((categoriesData: any[]): any[] => {
    if (!categoriesData || categoriesData.length === 0) return [];
    
    if (isPremium) {
      // Premium user: show ALL categories (both membership 0 and 1)
      return categoriesData;
    } else {
      // Non-premium user: show ONLY categories with is_membership === 0
      const freeCategories = categoriesData.filter(category => category.is_membership === 0);
      return freeCategories;
    }
  }, [isPremium]);

  const filterSubCategories = useCallback((subCategories: any[]): any[] => {
    if (!subCategories || subCategories.length === 0) return [];
    
    if (isPremium) {
      return subCategories;
    } else {
      return subCategories.filter(sub => sub.is_membership === 0);
    }
  }, [isPremium]);

  const mapCategories = useCallback((data: any[]): Category[] => {
    const filteredData = filterCategoriesByPremium(data);
    
    return filteredData.map((cat: { 
      id: any; 
      name: any; 
      icon: any; 
      childes: any;
      is_membership?: number;
    }) => ({
      id: cat.id,
      name: cat.name,
      title: cat.name,
      image: cat.icon,
      icon: cat.icon,
      is_membership: cat.is_membership || 0,
      subCategories: filterSubCategories(cat.childes || []).map((sub: { 
        id: any; 
        name: any; 
        icon: any; 
        products: any; 
        childes: any;
        is_membership?: number;
      }) => ({
        id: sub.id,
        name: sub.name,
        title: sub.name,
        image: sub.icon,
        icon: sub.icon,
        is_membership: sub.is_membership || 0,
        products: sub.products || [],
        childes: filterSubCategories(sub.childes || []),
      })),
    }));
  }, [filterCategoriesByPremium, filterSubCategories]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(Base_Url.allcategory);
      
      if (res.data && Array.isArray(res.data)) {
        const premiumCategories = res.data.filter((cat: any) => cat.is_membership === 1);
        const freeCategories = res.data.filter((cat: any) => cat.is_membership === 0);
        
        if (premiumCategories.length > 0) {
        }
      }
      
      const mappedCategories = mapCategories(res.data);
      setCategories(mappedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  }, [mapCategories]);

  const fetchHandmadeCategories = useCallback(async () => {
    try {
      const res = await axios.get(Base_Url.handmadecategory);
      if (res?.data?.data && Array.isArray(res.data.data)) {
        setHandmadeCategories(res.data.data);
      } else {
        setHandmadeCategories([]);
      }
    } catch (error: any) {
      console.error('Error fetching handmade categories:', error);
      setHandmadeCategories([]);
    }
  }, []);

  const loadAllData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    
    try {
      // First, check premium status fresh
      const premiumStatus = await checkPremiumStatus();
      
      await fetchCategories();
      await fetchHandmadeCategories();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [checkPremiumStatus, fetchCategories, fetchHandmadeCategories]);

  useEffect(() => {
    loadAllData(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAllData(true);
      return () => {
      };
    }, [loadAllData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAllData(false);
  }, [loadAllData]);

  const handleImageLoad = (itemId: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [itemId]: true,
    }));
  };

  const getImageUrl = (item: Category) => {
    const imagePath = item?.image || item?.icon;
    if (imagePath) {
      return `${base_url}/${imagePath}`;
    }
    return undefined;
  };

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate('SubCategories', { category: item });
      }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={IMAGES.imgplaceholder}
          style={styles.image}
          resizeMode="contain"
        />

        {getImageUrl(item) && (
          <Image
            source={{ uri: getImageUrl(item) }}
            style={[
              styles.image,
              styles.absoluteImage,
              {
                opacity: loadedImages[item.id] ? 1 : 0,
              },
            ]}
            resizeMode="contain"
            onLoad={() => handleImageLoad(item.id)}
            onError={() => handleImageLoad(item.id)} 
          />
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item?.title || item?.defaultname || 'Unnamed'}
      </Text>
      
      {/* Show premium badge for membership categories ONLY for non-premium users */}
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
          <Loader fullScreen size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const hasPremiumCategories = categories.some(cat => cat.is_membership === 1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.btnbg]}
            tintColor={COLORS.btnbg}
          />
        }
      >
        <Text style={styles.header}>{t('allCategories')}</Text>
        
        {/* Show premium info for non-premium users if there are premium categories */}
        {!isPremium && hasPremiumCategories && (
          <View style={styles.premiumInfoContainer}>
            <CustomText type="small" color={COLORS.textColor}>
              {t('upgradeToPremiumForMoreCategories') || 'Upgrade to Premium to unlock all categories'}
            </CustomText>
          </View>
        )}
        
        {/* Premium status indicator for debugging (remove in production) */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Status: {isPremium ? 'Premium User' : 'Free User'}
          </Text>
        </View>
        
       
        {categories.length > 0 ? (
          <FlatList
            data={categories}
            keyExtractor={item => item.id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            numColumns={3}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('noCategoriesFound')}</Text>
          </View>
        )}

        {handmadecategories.length > 0 && (
          <>
          
              
                <View style={styles.handmadeHeaderContainer}>
                  <CustomText type="subHeading" color={COLORS.btnbg}>
                    {t('HandmadeCategories')}
                  </CustomText>
                </View>
             

            <FlatList
              data={handmadecategories}
              keyExtractor={item => item.id?.toString() || Math.random().toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() => {
                    navigation.navigate('HandmadeSubcategories', { category: item });
                  }}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={IMAGES.imgplaceholder}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    {getImageUrl(item) && (
                      <Image
                        source={{ uri: getImageUrl(item) }}
                        style={[
                          styles.image,
                          styles.absoluteImage,
                          {
                            opacity: loadedImages[item.id] ? 1 : 0,
                          },
                        ]}
                        resizeMode="contain"
                        onLoad={() => handleImageLoad(item.id)}
                        onError={() => handleImageLoad(item.id)} 
                      />
                    )}
                  </View>
                  <Text style={styles.title} numberOfLines={2}>
                    {item?.title || item?.defaultname || 'Unnamed'}
                  </Text>
                </TouchableOpacity>
              )}
              numColumns={3}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.bckbtn 
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    textAlign: 'center',
    color: COLORS.black,
    marginBottom: verticalScale(30),
  },
  title1: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  handmadeHeaderContainer: {
    backgroundColor: COLORS.white,
    elevation:4,
    alignSelf: 'center',
    justifyContent:'center',
    borderWidth:1,
    alignItems: 'center',
    paddingHorizontal:horizontalScale(10),
    width:'95%',
    borderRadius:10,
    height:verticalScale(50),
    margin:verticalScale(10)
  },
  flatListContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    margin: 8,
    borderRadius: 12,
    paddingVertical: 26,
    width: ITEM_WIDTH,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 4,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
  absoluteImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.reviewcmt,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(50),
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.disableText,
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
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  debugContainer: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  debugText: {
    fontSize: 12,
    color: COLORS.textColor,
  },
});

export default AllCategories;

