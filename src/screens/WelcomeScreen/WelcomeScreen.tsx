import React from 'react';
import {View, Image} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './style';
import IMAGES from '../../assets/images';
import CustomButton from '../../components/Buttons/CustomButton';
import {horizontalScale, verticalScale} from '../../utils/Metrics';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingHorizontal: horizontalScale(15)}}>
        <Image
          source={IMAGES.logo}
          resizeMode="contain"
          style={styles.logoImg}
        />
        <CustomButton
          style={{marginTop: verticalScale(100)}}
          textSize="small"
          title="Let's get started"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
