import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';

type LoaderSize = 'small' | 'medium' | 'large';

type LoaderProps = {
  size?: LoaderSize;
  fullScreen?: boolean;
  containerStyle?: ViewStyle;
};

const sizeToPixels: Record<LoaderSize, number> = {
  small: 32,
  medium: 64,
  large: 120,
};

const Loader: React.FC<LoaderProps> = ({ size = 'medium', fullScreen = false, containerStyle }) => {
  const dimension = sizeToPixels[size];
  const Wrapper = fullScreen ? View : React.Fragment as any;
  const wrapperProps = fullScreen
    ? { style: [styles.fullScreen, containerStyle] }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <Image
        source={require('../assets/subcategory/loading.gif')}
        style={{ width: dimension, height: dimension }}
      />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;



