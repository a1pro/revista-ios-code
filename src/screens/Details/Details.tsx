
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   SafeAreaView,
//   Image,
//   FlatList,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../types';
// import styles from './style';
// import VectorIcon from '../../components/VectorIcon';
// import COLORS from '../../utils/Colors';
// import { verticalScale } from '../../utils/Metrics';
// import { isUserPremium, primeicon } from '../../utils/premimumuser';
// import { base_url } from '../../utils/ApiUrl';
// import Subscriptionstyle from '../../components/Subscriptionstyle';
// import { t } from 'i18next';
// import IMAGES from '../../assets/images';

// interface prime {
//   id: number;
//   general_icon: {
//     icon: string;
//     title: string;
//   };
//   prime_icon: {
//     icon: string;
//     title: string;
//   };
// }

// type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

// const Details: React.FC<Props> = ({ route, navigation }) => {
//   const [ispremimum, setispremimum] = useState<Boolean>(false);
//   const { products = [], subCategory } = (route.params as any);
//   const [icon, setprimeicon] = useState<prime | null>(null);
//   const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
// console.log(products, subCategory.childes)
//   const primeIcon = async () => {
//     const prime = await primeicon();
//     setprimeicon(prime.data[0]);
//   };

//   const premiumuser = async () => {
//     const premimum = await isUserPremium();
//     setispremimum(premimum);
//   };

//   useEffect(() => {
//     primeIcon();
//     premiumuser();
//   }, []);

//   const getDiscountedPrice = (price: number, discount: number, discountType: string) => {
//     if (discountType === 'flat') return price - discount;
//     return price - (price * discount) / 100;
//   };

//   const getDiscountText = (discount: number, discountType: string) => {
//     if (discountType === 'flat') return `${discount.toFixed(2)} SAR OFF`;
//     return `${discount}% OFF`;
//   };

//   const getSubscribeMessage = (discount: number, discountType: string) => {
//     if (discountType === 'flat') return `${t('nonprime')} ${discount.toFixed(2)} SAR off`;
//     return `${t('nonprime')} ${discount}% off`;
//   };

//   const renderProduct = (item: any) => {
//     // console.log(item)
//     const price = Number(item.unit_price) || 0;
//     const discount = Number(item.discount) || 0;
//     const discountType = item?.discount_type || 'percentage';
//     let displayPrice = price;
//     let showDiscountPrice = false;
//     let showSubscribeMessage = false;

//     if (ispremimum && discount > 0) {
//       displayPrice = getDiscountedPrice(price, discount, discountType);
//       showDiscountPrice = true;
//     } else if (!ispremimum && discount > 0) {
//       showSubscribeMessage = true;
//     }

//     const isLoaded = loadedImages[item.id];

//     return (
//       <TouchableOpacity
//         style={styles.productCard}
//         onPress={() => navigation.navigate('ProductDetails', { product: item })}     
//       >
//         <Image
//           source={isLoaded ? { uri: `${base_url}/${item.thumbnail}` } : IMAGES.imgplaceholder}
//           style={styles.productImage}
//           resizeMode="contain"
//           onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
//           onError={() => setLoadedImages(prev => ({ ...prev, [item.id]: false }))}
//         />

//         <View style={styles.nameandicon}>
//           <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
//           {icon?.general_icon?.icon && (
//             <Image
//               source={{ uri: `${base_url}/${icon.general_icon.icon}` }}
//               style={styles.primeicon}
//               resizeMode="contain"
//             />
//           )}
//         </View>

//         <View style={{ marginTop: 2, alignSelf: 'flex-start' }}>
//           {showDiscountPrice ? (
//             <View style={{ alignItems: 'flex-start' }}>
//               <Text style={[styles.price, { color: 'green', fontWeight: 'bold', fontSize: 20 }]}>
//                 {displayPrice.toFixed(2)} ﷼
//               </Text>
//               <Text style={{ textDecorationLine: 'line-through', color: 'gray', fontSize: 15 }}>
//                 {price.toFixed(2)} ﷼
//               </Text>
//               <Text style={{ color: '#e63946', fontWeight: 'bold' }}>
//                 ({getDiscountText(discount, discountType)})
//               </Text>
//             </View>
//           ) : showSubscribeMessage ? (
//             <View>
//               <Text style={[styles.price, { color: COLORS.appColor, fontWeight: 'bold', fontSize: 20 }]}>
//                 {price.toFixed(2)} ﷼
//               </Text>
//               <Text style={{ fontSize: 12, color: COLORS.headertext, textAlign: 'center', marginTop: 2 }}>
//                 {getSubscribeMessage(discount, discountType)}
//               </Text>
//             </View>
//           ) : (
//             <Text style={[styles.price, { color: COLORS.appColor, fontWeight: 'bold', fontSize: 20 }]}>
//               {price.toFixed(2)} ﷼
//             </Text>
//           )}

//           {ispremimum && <Subscriptionstyle expectedDeliveryTime={`Next ${item?.shipping_days} Days`|| "Next 10 Days"} />}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <VectorIcon
//             size={30}
//             type="AntDesign"
//             name="left"
//             color={COLORS.black}
//             style={{ marginRight: verticalScale(30) }}
//           />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{subCategory?.title || 'Products'}</Text>
//         <View style={styles.placeholder} />
//       </View>

//       {products.length > 0 ? (
//         <FlatList
//           data={products}
//           renderItem={({ item }) => renderProduct(item)}
//           keyExtractor={item => item.id.toString()}
//           numColumns={2}
//           contentContainerStyle={styles.productList}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : (
//         <Text style={{ textAlign: 'center', margin: 32, fontSize: 16, color: COLORS.review }}>
//           {t('noproductavailable')}
//         </Text>
//       )}
//     </SafeAreaView>
//   );
// };

// export default Details;


import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import styles from './style';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import { verticalScale } from '../../utils/Metrics';
import { isUserPremium, primeicon } from '../../utils/premimumuser';
import { base_url } from '../../utils/ApiUrl';
import Subscriptionstyle from '../../components/Subscriptionstyle';
import { t } from 'i18next';
import SafeImage from '../../components/SafeImage'; // Import SafeImage component
import { SafeAreaView } from 'react-native-safe-area-context';

interface prime {
  id: number;
  general_icon: {
    icon: string;
    title: string;
  };
  prime_icon: {
    icon: string;
    title: string;
  };
}

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

const Details: React.FC<Props> = ({ route, navigation }) => {
  const [ispremimum, setispremimum] = useState<Boolean>(false);
  const { products = [], subCategory } = (route.params as any);
  const [icon, setprimeicon] = useState<prime | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [allSubCategories, setAllSubCategories] = useState<any[]>([]);

  console.log('Products:', products);
  console.log('SubCategory childes:', subCategory?.childes);

  const primeIcon = async () => {
    const prime = await primeicon();
    setprimeicon(prime.data[0]);
  };

  const premiumuser = async () => {
    const premimum = await isUserPremium();
    setispremimum(premimum);
  };

  useEffect(() => {
    primeIcon();
    premiumuser();
  }, []);

  // Extract all subcategories including nested ones
  useEffect(() => {
    if (subCategory?.childes) {
      const extractAllSubCategories = (categories: any[]): any[] => {
        let result: any[] = [];
        categories.forEach((cat: any) => {
          result.push(cat);
          if (cat.childes && cat.childes.length > 0) {
            result = result.concat(extractAllSubCategories(cat.childes));
          }
        });
        return result;
      };
      
      const allCats = extractAllSubCategories(subCategory.childes);
      setAllSubCategories(allCats);
    }
  }, [subCategory]);

  // Filter products when a subcategory is selected
  useEffect(() => {
    if (selectedSubCategory) {
      // Find the selected category to check if it has products directly
      const selectedCat = allSubCategories.find(cat => cat.id === selectedSubCategory);
      
      // Check if the selected category has products directly
      if (selectedCat?.products && selectedCat.products.length > 0) {
        // Use products from the category itself
        setFilteredProducts(selectedCat.products);
      } else {
        // Filter products based on sub_sub_category_id
        const filtered = products.filter((product: any) => {
          // Check if product belongs to this subcategory
          return product.sub_sub_category_id === selectedSubCategory ||
                 product.sub_category_id === selectedSubCategory ||
                 product.category_id === selectedSubCategory ||
                 (product.category_ids && product.category_ids.includes(selectedSubCategory));
        });
        setFilteredProducts(filtered);
      }
    } else {
      // Show all products when "All" is selected
      setFilteredProducts(products);
    }
  }, [selectedSubCategory, products, allSubCategories]);

  const getDiscountedPrice = (price: number, discount: number, discountType: string) => {
    if (discountType === 'flat') return price - discount;
    return price - (price * discount) / 100;
  };

  const getDiscountText = (discount: number, discountType: string) => {
    if (discountType === 'flat') return `${discount.toFixed(2)} SAR OFF`;
    return `${discount}% OFF`;
  };

  const getSubscribeMessage = (discount: number, discountType: string) => {
    if (discountType === 'flat') return `${t('nonprime')} ${discount.toFixed(2)} SAR off`;
    return `${t('nonprime')} ${discount}% off`;
  };

  const renderSubCategoryItem = (item: any) => {
    const isSelected = selectedSubCategory === item.id;
    const iconUrl = item.icon ? `${base_url}/${item.icon}` : null;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.subCategoryItem,
          isSelected && styles.subCategoryItemSelected,
        ]}
        onPress={() => {
          if (isSelected) {
            setSelectedSubCategory(null); // Deselect if already selected
          } else {
            setSelectedSubCategory(item.id);
          }
        }}
      >
        <View style={styles.subCategoryIconContainer}>
          {iconUrl ? (
            <SafeImage
              uri={ item.icon ? `${base_url}/${item.icon}` : null}
              style={styles.subCategoryIcon}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.subCategoryIconPlaceholder}>
              <Text style={styles.subCategoryIconText}>
                {item.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <Text 
          style={[
            styles.subCategoryName,
            isSelected && styles.subCategoryNameSelected,
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderProduct = (item: any) => {
    const price = Number(item.unit_price) || 0;
    const discount = Number(item.discount) || 0;
    const discountType = item?.discount_type || 'percentage';
    let displayPrice = price;
    let showDiscountPrice = false;
    let showSubscribeMessage = false;

    if (ispremimum && discount > 0) {
      displayPrice = getDiscountedPrice(price, discount, discountType);
      showDiscountPrice = true;
    } else if (!ispremimum && discount > 0) {
      showSubscribeMessage = true;
    }

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate('ProductDetails', { product: item })}     
      >
        {/* Using SafeImage component for proper placeholder handling */}
        <SafeImage
          uri={item.thumbnail ? `${base_url}/${item.thumbnail}` : null}
          style={styles.productImage}
          resizeMode="contain"
        />

        <View style={styles.nameandicon}>
          <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          {icon?.general_icon?.icon && (
            <Image
              source={{ uri: `${base_url}/${icon.general_icon.icon}` }}
              style={styles.primeicon}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={{ marginTop: 2, alignSelf: 'flex-start' }}>
          {showDiscountPrice ? (
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={[styles.price, { color: 'green', fontWeight: 'bold', fontSize: 20 }]}>
                {displayPrice.toFixed(2)} ﷼
              </Text>
              <Text style={{ textDecorationLine: 'line-through', color: 'gray', fontSize: 15 }}>
                {price.toFixed(2)} ﷼
              </Text>
              <Text style={{ color: '#e63946', fontWeight: 'bold' }}>
                ({getDiscountText(discount, discountType)})
              </Text>
            </View>
          ) : showSubscribeMessage ? (
            <View>
              <Text style={[styles.price, { color: COLORS.appColor, fontWeight: 'bold', fontSize: 20 }]}>
                {price.toFixed(2)} ﷼
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.headertext, textAlign: 'center', marginTop: 2 }}>
                {getSubscribeMessage(discount, discountType)}
              </Text>
            </View>
          ) : (
            <Text style={[styles.price, { color: COLORS.appColor, fontWeight: 'bold', fontSize: 20 }]}>
              {price.toFixed(2)} ﷼
            </Text>
          )}

          {ispremimum && (
            <Subscriptionstyle 
              expectedDeliveryTime={`Next ${item?.shipping_days || 10} Days`} 
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Function to render subcategory list with all nested categories
  const renderAllSubCategories = () => {
    if (!subCategory?.childes || subCategory.childes.length === 0) {
      return null;
    }

    // Flatten all subcategories for display
    const flattenCategories = (categories: any[]): any[] => {
      let result: any[] = [];
      categories.forEach((cat: any) => {
        result.push(cat);
        if (cat.childes && cat.childes.length > 0) {
          result = result.concat(flattenCategories(cat.childes));
        }
      });
      return result;
    };

    const allCats = flattenCategories(subCategory.childes);

    return (
      <View style={styles.subCategoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subCategoryScrollContent}
        >
          {/* "All" option to show all products */}
          <TouchableOpacity
            style={[
              styles.subCategoryItem,
              !selectedSubCategory && styles.subCategoryItemSelected,
            ]}
            onPress={() => setSelectedSubCategory(null)}
          >
            <View style={styles.subCategoryIconContainer}>
              <View style={styles.subCategoryIconPlaceholder}>
                <Text style={styles.subCategoryIconText}>{t('all')}</Text>
              </View>
            </View>
            <Text 
              style={[
                styles.subCategoryName,
                !selectedSubCategory && styles.subCategoryNameSelected,
              ]}
            >
             {t('all')}
            </Text>
          </TouchableOpacity>

          {allCats.map((cat: any) => renderSubCategoryItem(cat))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <VectorIcon
            size={30}
            type="AntDesign"
            name="left"
            color={COLORS.black}
            style={{ marginRight: verticalScale(30) }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{subCategory?.title || 'Products'}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Horizontal SubCategory List with all nested categories */}
      {renderAllSubCategories()}

      {/* Product List */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => renderProduct(item)}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', margin: 32, fontSize: 16, color: COLORS.review }}>
              {t('noproductavailable')}
            </Text>
          }
        />
      ) : (
        <Text style={{ textAlign: 'center', margin: 32, fontSize: 16, color: COLORS.review }}>
          {t('noproductavailable')}
        </Text>
      )}
    </SafeAreaView>
  );
};

export default Details;