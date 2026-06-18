import React from 'react';
import {
  View,
  SafeAreaView,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import styles from './style';
import IMAGES from '../../assets/images';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import { verticalScale } from '../../utils/Metrics';
import { t } from 'i18next';

type Props = NativeStackScreenProps<RootStackParamList, 'HandmadeProducts'>;

const HandmadeProducts: React.FC<Props> = ({ route, navigation }) => {
  const { products = [], subcategory } = (route.params as any);

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
        <Text style={styles.headerTitle}>
          {subcategory?.name || 'Products'}
        </Text>
      </View>

      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
            >
              <Image
                source={
                  item.images?.[0]
                    ? { uri: item.images[0] }
                    : (IMAGES as any).default
                }
                style={styles.productImage}
                resizeMode="contain"
              />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                {item.unit_price ? `﷼${item.unit_price}` : (item.price ? `$${item.price}` : '')}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noproduct}>
          {t('noproductavailable')}
        </Text>
      )}
    </SafeAreaView>
  );
};

export default HandmadeProducts;
