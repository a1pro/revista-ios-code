
import React, {useEffect} from 'react';
import {View, Image, ActivityIndicator, BackHandler} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './style';
import IMAGES from '../../assets/images';
import {useAuth} from '../../context/AuthContext';
import COLORS from '../../utils/Colors';
import Loader from '../../components/Loader';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({navigation}) => {
  const {isAuthenticated, isLoading} = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          // Clear entire navigation stack and go to Dashboard
          navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          });
        } else {
          // Clear entire navigation stack and go to Welcome
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          });
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={IMAGES.revista22}
          resizeMode="contain"
          style={styles.logoImg}/>
        <Loader
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
