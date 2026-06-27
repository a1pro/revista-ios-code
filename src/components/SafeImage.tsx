import React, { useState } from 'react';
import { View, Image } from 'react-native';
import IMAGES from '../assets/images';

type Props = {
  uri?: string | null;
  style: any;
  resizeMode?: 'cover' | 'contain' | 'stretch';
};

const SafeImage: React.FC<Props> = ({
  uri,
  style,
  resizeMode = 'cover',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const showPlaceholder = !uri || error || !loaded;

  return (
    <View style={style}>
      {/* Placeholder */}
      {showPlaceholder && (
        <Image
          source={IMAGES.imgplaceholder}
          style={[style, { position: 'absolute' }]}
          resizeMode="cover"
        />
      )}

      {/* Real Image */}
      {uri && !error && (
        <Image
          source={{ uri }}
          style={[style, { opacity: loaded ? 1 : 0 }]}
          resizeMode={resizeMode}
          onLoadStart={() => setLoaded(false)}
          onLoadEnd={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </View>
  );
};

export default SafeImage;