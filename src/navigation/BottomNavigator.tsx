/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import AllCategories from '../screens/AllCategories/AllCategories';
import Profile from '../screens/Profile/Profile';
import AddtoCart from '../screens/AddtoCart/AddtoCart';
import Magzine from '../screens/Book/Magzine';
import COLORS from '../utils/Colors';
import IMAGES from '../assets/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabParamList = {
  Home: undefined;
  AddtoCart: undefined;
  Magzine: undefined;
  Profile: undefined;
  AllCategories: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const CustomTabBarButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    activeOpacity={1}
    onPress={onPress}
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      // paddingBottom: insets.bottom,
      ...Platform.select({
        ios: {
          shadowColor: COLORS.black,
          shadowOffset: { width: 10, height: 10 },
          shadowOpacity: 0.12,
          shadowRadius: 5,
        },
        android: {
          elevation: 8,
        },
      }),
    }}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.revista2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={IMAGES.revista22}
        style={{ width: 70, height: 70,top:10 , borderRadius:35 }}
        resizeMode="contain"
      />
      <Text
        style={{
          color: COLORS.white,
          fontSize: 13,
          fontWeight: 'bold',
          marginTop: 2,
        }}
      >
        {/* You can add {t('magazine')} here if you want */}
      </Text>
    </View>
  </TouchableOpacity>
);

const BottomNavigator: React.FC = () => {
  const { t } = useTranslation();
const insets = useSafeAreaInsets();
  const getTabLabel = (routeName: keyof TabParamList): string => {
    switch (routeName) {
      case 'Home':
        return t('home');
      case 'AllCategories':
        return t('allCategories');
      case 'Magzine':
        return t('magazine');
      case 'AddtoCart':
        return t('cart');
      case 'Profile':
        return t('profile');
      default:
        return routeName;
    }
  };

  return (
    
    <Tab.Navigator 
    
      screenOptions={({ route }) => ({
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: COLORS.revista2 ,
        tabBarInactiveTintColor: COLORS.appColor,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 5,
           paddingBottom: insets.bottom,
        },
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
           height: 75+ insets.bottom,  
          paddingBottom: insets.bottom,
          // height: 70,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
        tabBarIcon: ({ focused, color }) => {
          if (route.name === 'Magzine') {
            return null;
          }
          let iconName: string;
          let IconComponent: typeof Feather;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              IconComponent = Feather;
              break;
            case 'AllCategories':
              iconName = 'layout';
              IconComponent = Feather;
              break;
            case 'Profile':
              iconName = 'user';
              IconComponent = Feather;
              break;
            case 'AddtoCart':
              iconName = 'shopping-cart';
              IconComponent = Feather;
              break;
            default:
              iconName = 'users';
              IconComponent = MaterialIcons;
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <IconComponent name={iconName} size={26} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AllCategories"
        component={AllCategories}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Magzine"
        component={Magzine}
        options={{
          headerShown: false,
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="AddtoCart"
        component={AddtoCart}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
