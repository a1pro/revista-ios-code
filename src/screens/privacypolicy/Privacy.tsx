import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import WebView from 'react-native-webview';

import { styles } from './style';
import { RootStackParamList } from '../../types';
import { base_url } from '../../utils/ApiUrl';
import Loader from '../../components/Loader';

type Props = NativeStackScreenProps<RootStackParamList, 'Privacypolicy'>;

const Privacy: React.FC<Props> = () => {
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: `${base_url}/privacy-policy` }}
          style={{ flex: 1 }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => setLoading(false)}
        />

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
              backgroundColor: '#fff',
            }}
          >
            <Loader fullScreen size="large" />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Privacy;