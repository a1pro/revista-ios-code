import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { WebView } from 'react-native-webview';
import { RootStackParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import { CustomText } from '../../components/CustomText';
import forgotstyle from './forgotstyle';
import { base_url } from '../../utils/ApiUrl';
import Loader from '../../components/Loader';
type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPass'>;
const ForgotPass: React.FC<Props> = ({navigation}) => {
  const [loading, setLoading] = useState<boolean>(true);
  return (
   <SafeAreaView style={forgotstyle.container}>
      <View style={forgotstyle.innerContainer}>
        <View style={forgotstyle.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={forgotstyle.backButton}>
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
            style={forgotstyle.title}>
            Forgot Password
          </CustomText>

          <View style={forgotstyle.placeholder} />
        </View>
        
        <View style={{ flex: 1 }}>
          {loading && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,

              }}>
              <Loader size="large" />
            </View>
          )}
          <WebView source={{ uri: `${base_url}/customer/auth/recover-password` }}
            style={{ flex: 1 }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />

        </View>
      </View>
    </SafeAreaView>
  )
}

export default ForgotPass