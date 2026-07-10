import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../utils/Colors';
import { base_url } from '../utils/ApiUrl';
import { primeicon } from '../utils/premimumuser';
import { t } from 'i18next';
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
interface SubscriptionstyleProps {
  expectedDeliveryTime?: string;
}

const Subscriptionstyle: React.FC<SubscriptionstyleProps> = ({ 
  expectedDeliveryTime = "Next 10 Days" 
}) => {
  const [icon, setprimeicon] = useState<prime | null>(null);

  const primeIcon = async () => {
    const prime = await primeicon();
    setprimeicon(prime.data[0]);
  };
  useEffect(() => {
    primeIcon();
  }, []);
  return (
    <>
      <View style={styles.primeUserRow}>
        {icon?.prime_icon?.icon && (
          <Image
            source={{ uri: `${base_url}/${icon.prime_icon.icon}` }}
            style={[styles.primeicon, styles.primeUserIcon]}
          />
        )}
        <Text style={styles.primeUserText}>
          {t('primeuser')}
        </Text>
      </View>

      <View style={styles.featureRow}>
        <View style={styles.feature}>
          <MaterialCommunityIcons name="truck-fast" size={18} color="#4caf50" />
          <Text style={styles.featureText}>{t('Free delivery')}</Text>
        </View>
        
        <View style={styles.deliveryBadge}>
          <View style={styles.expressBadge}>
            <Text style={styles.expressBadgeText}>{t('express')}</Text>
          </View>

          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>{expectedDeliveryTime}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default Subscriptionstyle;

const styles = StyleSheet.create({
  primeicon: {
    borderRadius: 100,
    height: 25,
    width: 25,
  },
  primeUserRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '90%',
  },
  primeUserIcon: {
    marginRight: '5%',
  },
  primeUserText: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 12,
    fontStyle: 'italic',
  },
  featureRow: {
    // flexDirection: 'row',
    justifyContent: 'flex-start',
    // alignItems: 'center',
    width: '90%',
  },
  feature: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginRight: 20,
  },
  featureText: {
    fontSize: 12,
    color: '#555',
    flex: 1,
    marginLeft: 8,
  },
  express: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: COLORS.star,
  },
  expressText: {
    fontSize: 12,
  },
  deliveryBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  borderRadius: 12,
  marginTop: 4,
},

expressBadge: {
  backgroundColor: '#FFD400', // Yellow
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderTopLeftRadius: 12,
  borderBottomLeftRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
},

expressBadgeText: {
  color: '#000',
  fontSize: 11,
  fontWeight: '700',
  fontStyle: 'italic',
  textTransform: 'lowercase',
},

timeBadge: {
  backgroundColor: '#1A1A1A',
  paddingHorizontal: 12,
  paddingVertical: 5,
  borderBottomRightRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
},

timeBadgeText: {
  color: '#FFF',
  fontSize: 11,
  fontWeight: '700',
  fontStyle: 'italic',
},
});
