/* eslint-disable no-trailing-spaces */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen/WelcomeScreen';
import BottomNavigator from './BottomNavigator';
import Details from '../screens/Details/Details';
import ProductDetails from '../screens/ProductDetails/ProductDetails';
import EditProfile from '../screens/Profile/EditProfile';
import WishList from '../screens/Profile/WishList';
import Address from '../screens/Address/Address';
import Order from '../screens/Order/Order';
import Language from '../screens/Language/Language';
import SaveAddress from '../screens/SaveAddress/SaveAddress';
import Terms from '../screens/Terms&Conditions/Terms';
import SubCategories from '../screens/AllCategories/SubCategories';
import MagzineProduct from '../screens/Book/MagzineProduct';
import AllSellerScreen from '../screens/Seller/AllSellerScreen';
import SellerDetails from '../screens/Seller/SellerDetails';
import Inbox from '../screens/Chat/Inbox';
import ChatScreen from '../screens/Chat/ChatScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import Seller from '../screens/Seller/Seller';
import AllLatestProducts from '../screens/AllLatestProducts/AllLatestProducts';
import HandmadeSubcategories from '../screens/AllCategories/HandmadeSubcategories';
import HandmadeProducts from '../screens/Details/HandmadeProducts';
import BrandedProductSubCategories from '../screens/AllCategories/BrandedProductSubCategories';
import Subscriptionscreen from '../screens/Subscription/Subscriptionscreen';
import PaymentScreen from '../screens/payment/PaymentScreen';
import Invoice from '../screens/Invoice/Invoice';
import ProductReviewScreen from '../screens/productreview/ProductReviewScreen';
import ForgotPass from '../screens/ForgotPassword/ForgotPass';
import Privacy from '../screens/privacypolicy/Privacy';
import ProfileInformation from '../screens/Profile/ProfileInformation';
import AddtoCart from '../screens/AddtoCart/AddtoCart';
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <SafeAreaProvider>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPass"
          component={ForgotPass}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SubCategories"
          component={SubCategories}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={BottomNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WishList"
          component={WishList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Order"
          component={Order}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Language"
          component={Language}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SaveAddress"
          component={SaveAddress}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Address"
          component={Address}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Terms"
          component={Terms}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MagazineProduct"
          component={MagzineProduct}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AllSellerScreen"
          component={AllSellerScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SellerDetails"
          component={SellerDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Inbox"
          component={Inbox}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddtoCart"
          component={AddtoCart}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CheckoutScreen"
          component={CheckoutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Seller"
          component={Seller}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AllLatestProducts"
          component={AllLatestProducts}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HandmadeSubcategories"
          component={HandmadeSubcategories}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HandmadeProducts"
          component={HandmadeProducts}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BrandedProductSubCategories"
          component={BrandedProductSubCategories}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Subscriptionscreen"
          component={Subscriptionscreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Invoice"
          component={Invoice}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductReviewScreen"
          component={ProductReviewScreen}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="PremiumCheckout"
          component={PremiumCheckout}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Privacypolicy"
          component={Privacy}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profileinfo"
          component={ProfileInformation}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>

    </SafeAreaProvider>
  </NavigationContainer>
);

export default AppNavigator;
