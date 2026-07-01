import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import IMAGES from '../../assets/images';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { base_url } from '../../utils/ApiUrl';
import SafeImage from '../../components/SafeImage';

const SUBCATEGORY_IMAGE_MAP: Record<string, any> = {
  'test abaya': IMAGES.imgplaceholder,
  'test hair': IMAGES.imgplaceholder,
  'test ecssorise': IMAGES.imgplaceholder,
  'test hena': IMAGES.imgplaceholder,
};

type Props = NativeStackScreenProps<RootStackParamList, 'HandmadeSubcategories'>;

const HandmadeSubcategories: React.FC<Props> = ({ route, navigation }) => {
  const { category } = (route.params as any) || null;
  const { t } = useTranslation();

  const renderSubCategory = ({ item }: any) => {
    const staticImage = SUBCATEGORY_IMAGE_MAP[item.name?.toLowerCase()];
    const imageSource = item.icon

    return (
      <TouchableOpacity
        onPress={() => {
          (navigation as any).navigate('HandmadeProducts', { subcategory: item, products: item.products || [] });
        }}
        style={styles.subCategory}
      >
        <SafeImage
          uri={item.icon ? `${base_url}/${item.icon}` : null}
          style={styles.subCategoryImage}
          resizeMode="cover"
        />
        <Text style={styles.subCategoryText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <VectorIcon
              size={24}
              type="AntDesign"
              name="left"
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.header}>
            {category.defaultname || category.name}
          </Text>
          <View style={styles.placeholder} />
        </View>
        <FlatList
          data={category.subcategories || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSubCategory}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {t('nosubcategory') ?? 'No Subcategories found.'}
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bckbtn },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.bckbtn,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: { width: 40 },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  subCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginBottom: 10,
    padding: 14,
    borderRadius: 10,
    elevation: 1,
  },
  subCategoryImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
    backgroundColor: '#eaeaea',
  },
  subCategoryText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.reviewcmt,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.review,
    marginTop: 32,
    fontSize: 16,
  },
});

export default HandmadeSubcategories;
