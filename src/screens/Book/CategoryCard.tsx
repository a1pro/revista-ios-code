import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Loader from '../../components/Loader';
import COLORS from '../../utils/Colors';

interface CategoryCardProps {
  item: {
    id: number;
    name: string;
    icon: string;
  };
}

const CategoryCard = ({ item }: CategoryCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => (navigation as any).navigate('MagazineProduct', { categoryId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={ { uri: item?.icon }}
          style={styles.categoryImage}
          resizeMode="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        {imageLoading && (
          <View style={styles.imagesload}>
            <Loader size="small" />
          </View>
        )}
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  imagesload: { position: 'absolute',
    top: 0,
     left: 0,
      right: 0,
       bottom: 0,
        alignItems: 'center',
    justifyContent: 'center' },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#e9ecef',
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
  },
  categoryName: {
    textAlign: 'center',
    padding: 8,
    fontWeight: 'bold',
    color: COLORS.reviewcmt,
  },
});

export default CategoryCard;
