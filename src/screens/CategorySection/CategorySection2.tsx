import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { base_url, Base_Url } from '../../utils/ApiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from 'i18next';
import COLORS from '../../utils/Colors';
import IMAGES from '../../assets/images';
import { SafeAreaView } from 'react-native-safe-area-context';


type Props = NativeStackScreenProps<RootStackParamList, 'CategorySection2'>;

const CategorySection2: React.FC<Props> = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});
  const navigation = useNavigation();

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(Base_Url.handmadeurl, { headers: { Authorization: `Bearer:${token}` } });
      setCategories(res?.data?.data || []);
    } catch (error) {
      setCategories([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => (navigation.navigate as any)('HandmadeSubcategories', { category: item })}
    >
     <View style={styles.imageContainer}>
  {/* Placeholder */}
  {!loadedImages[item.id] && (
    <Image
      source={IMAGES.imgplaceholder}
      style={[styles.image, { position: 'absolute' }]}
      resizeMode="contain"
    />
  )}

  {/* Actual Image */}
  <Image
    source={{ uri: `${base_url}/${item?.icon}` }}
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
      <Text style={styles.title} numberOfLines={1}>
        {item?.defaultname || item?.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{t('HandmadeCategories')}</Text>
        <View style={styles.seeAllRow}>
          {/* Add a See All press logic if needed */}
        </View>
      </View>
      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.white, paddingVertical: 12 },
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
    color: '#007AFF',
    marginRight: 4,
  },
  arrow: {
    fontSize: 18,
    color: '#007AFF',
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
  },
  imageContainer: {
  width: 64,
  height: 64,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 8,
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
});

export default CategorySection2;
