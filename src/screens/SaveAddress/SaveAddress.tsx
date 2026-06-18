/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,


} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { CustomText } from '../../components/CustomText';
import COLORS from '../../utils/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './style';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Base_Url } from '../../utils/ApiUrl';
import VectorIcon from '../../components/VectorIcon';

import Loader from '../../components/Loader';

type AddressType = {
  id: number | string;
  address: string;
  city: string;
  zip: string;
  phone: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'SaveAddress'>;

const SaveAddress: React.FC<Props> = ({ navigation }) => {
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const selectedId = useSelector(
    (state: RootState) => state.address.selectedId,
  );

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      setError('');
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setError('No token found. Please login again.');
          setAddresses([]);
          setLoading(false);
          return;
        }
        const res = await axios.get(Base_Url.getAddress, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Ensure the response is always an array
        setAddresses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Failed to fetch addresses. Please try again.');
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>

        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <VectorIcon
              type="AntDesign"
              name="left"
              size={24}
              color={COLORS.textColor}
            />
          </TouchableOpacity>
          <CustomText
            type="heading"
            color={COLORS.textColor}
            fontWeight="bold"
            style={styles.title}>
            Saved Addresses
          </CustomText>
          <View style={styles.placeholder} />
        </View>

        {loading ? (
          <Loader fullScreen size="large" />
        ) : error ? (
          <View style={styles.addressBox}>
            <CustomText style={styles.value} color="red">
              {error}
            </CustomText>
          </View>
        ) : addresses.length === 0 ? (
          <View style={styles.addressBox}>
            <CustomText style={styles.value}>No addresses saved.</CustomText>
          </View>
        ) : (
          <FlatList
            data={addresses}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => (navigation as any).navigate('Dashboard', {
                  screen: 'AddtoCart',
                  params: { selectedAddress: item },
                })}
              >

                <View
                  style={[
                    styles.addressBox,
                    item.id === selectedId && {
                      borderColor: COLORS.appColor || '#0066FF',
                      borderWidth: 2,
                    },
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}>
                    <CustomText style={styles.label} color={COLORS.textColor}>
                      Address:
                    </CustomText>
                    {item.id === selectedId && (
                      <Icon
                        name="check-circle"
                        size={18}
                        color={COLORS.appColor || '#0066FF'}
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </View>
                  <CustomText style={styles.value}>
                    {item.address || 'N/A'}
                  </CustomText>
                  <CustomText style={styles.label} color={COLORS.textColor}>
                    City:
                  </CustomText>
                  <CustomText style={styles.value}>
                    {item.city || 'N/A'}
                  </CustomText>
                  <CustomText style={styles.label} color={COLORS.textColor}>
                    Postcode:
                  </CustomText>
                  <CustomText style={styles.value}>
                    {item.zip || 'N/A'}
                  </CustomText>
                  <CustomText style={styles.label} color={COLORS.textColor}>
                    Phone:
                  </CustomText>
                  <CustomText style={styles.value}>
                    {item.phone || 'N/A'}
                  </CustomText>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SaveAddress;
