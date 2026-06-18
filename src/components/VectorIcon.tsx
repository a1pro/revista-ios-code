// src/components/common/VectorIcon.tsx

import React from 'react';
import {
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
  StyleProp,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

type IconType =
  | 'FontAwesome'
  | 'Ionicons'
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'Entypo'
  | 'AntDesign'
  | 'Feather';

interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
  type?: IconType;
  style?: StyleProp<TextStyle | ViewStyle>;
  onPress?: (event: GestureResponderEvent) => void;
}

const VectorIcon: React.FC<AppIconProps> = ({
  name,
  size = 24,
  color = 'black',
  type = 'FontAwesome',
  style,
  onPress,
}) => {
  let IconComponent;

  switch (type) {
    case 'Ionicons':
      IconComponent = Ionicons;
      break;
    case 'MaterialIcons':
      IconComponent = MaterialIcons;
      break;
    case 'MaterialCommunityIcons':
      IconComponent = MaterialCommunityIcons;
      break;
    case 'Entypo':
      IconComponent = Entypo;
      break;
    case 'AntDesign':
      IconComponent = AntDesign;
      break;
    case 'Feather':
      IconComponent = Feather;
      break;
    case 'FontAwesome':
    default:
      IconComponent = FontAwesome;
  }

  const iconElement = (
    <IconComponent name={name} size={size} color={color} style={style} />
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {iconElement}
      </TouchableOpacity>
    );
  }

  return iconElement;
};

export default VectorIcon;
