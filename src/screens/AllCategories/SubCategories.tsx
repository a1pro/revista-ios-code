// import React from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   SafeAreaView,
// } from 'react-native';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {RootStackParamList} from '../../types';
// import IMAGES from '../../assets/images';
// import VectorIcon from '../../components/VectorIcon';
// import COLORS from '../../utils/Colors';
// import { useTranslation } from 'react-i18next';
// import { base_url } from '../../utils/ApiUrl';



// type Props = NativeStackScreenProps<RootStackParamList, 'SubCategories'>;

// const SubCategories: React.FC<Props> = ({route, navigation}) => {
//   const { category } = route.params;
//   const { t } = useTranslation();

//   const renderSubCategory = ({item}: {item:any}) => {
    
//     const imageSource =  {uri: `${base_url}/${item.image}`};
//     return (
//       <TouchableOpacity
//         onPress={() => {
//           (navigation as any ).navigate('Details', { subCategory: item, products: item.products || [] });
//         }}
//         style={styles.subCategory}
//       >
//         <Image source={imageSource} style={styles.subCategoryImage} />
//         <Text style={styles.subCategoryText}>{item.title}</Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.container}>
//         <View style={styles.headerContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}>
//             <VectorIcon
//               size={24}
//               type="AntDesign"
//               name="left"
//               color={COLORS.black}
//             />
//           </TouchableOpacity>
//           <Text style={styles.header}>{category.title}</Text>
//           <View style={styles.placeholder} />
//         </View>
//         <FlatList
//           data={category.subCategories}
//           keyExtractor={item => item.id.toString()}
//           renderItem={renderSubCategory}
//           contentContainerStyle={styles.flatListContent}
//           showsVerticalScrollIndicator={false}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>{t('nosubcategory')}</Text>
//           }
//         />
//       </View>
//     </SafeAreaView>
//   );
// };
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import IMAGES from '../../assets/images';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import { useTranslation } from 'react-i18next';
import { base_url } from '../../utils/ApiUrl';

type Props = NativeStackScreenProps<RootStackParamList, 'SubCategories'>;

const SubCategories: React.FC<Props> = ({route, navigation}) => {
  const { category } = route.params;
  // console.log(category)
  const { t } = useTranslation();

  const [loadedImages, setLoadedImages] = useState<{[key: string]: boolean}>({});

  const renderSubCategory = ({item}: {item:any}) => {
    const imageUri = `${base_url}/${item.image}`;

    return (
      <TouchableOpacity
        onPress={() => {
          (navigation as any ).navigate('Details', { subCategory: item, products: item.products || [] });
        }}
        style={styles.subCategory}
      >
        <View style={{ width: 100, height: 100, marginRight: 12 }}>
          {/* Placeholder */}
          {!loadedImages[item.id] && (
            <Image
              source={IMAGES.imgplaceholder}
              style={styles.subCategoryImage}
              resizeMode="cover"
            />
          )}

          {/* Actual Image */}
          <Image
            source={{ uri: imageUri }}
            style={styles.subCategoryImage}
            resizeMode="cover"
            onLoad={() => {
              setLoadedImages(prev => ({ ...prev, [item.id]: true }));
            }}
            onError={() => {
              setLoadedImages(prev => ({ ...prev, [item.id]: false }));
            }}
          />
        </View>

        <Text style={styles.subCategoryText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <VectorIcon
              size={24}
              type="AntDesign"
              name="left"
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.header}>{category.title}</Text>
          <View style={styles.placeholder} />
        </View>

        <FlatList
          data={category.subCategories}
          keyExtractor={item => item.id.toString()}
          renderItem={renderSubCategory}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('nosubcategory')}</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

// export default SubCategories;
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.bckbtn},
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
    shadowOffset: {width: 0, height: 2},
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
  placeholder: {
    width: 40,
  },
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

export default SubCategories;
