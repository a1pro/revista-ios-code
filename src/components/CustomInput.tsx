import React, {FC, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Text,
} from 'react-native';
import {CustomText} from './CustomText';
import {
  horizontalScale,
  responsiveFontSize,
  verticalScale,
} from '../utils/Metrics';
import COLORS from '../utils/Colors';
import VectorIcon from './VectorIcon';

type CustomInputProps = {
  placeholder: string;
  type?: 'text' | 'password' | 'search' | 'date';
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  value: string;
  style?: object;
  isFilterIcon?: boolean;
  onFilterPress?: () => void;
  label?: string;
  heigth?: number;
  disabled?: boolean;
  maxDate?: Date;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
};

const CustomInput: FC<CustomInputProps> = ({
  placeholder,
  onChangeText,
  onBlur, // ✅ Accept as a prop

  value,
  style,
  type = 'text',
  label,
  isFilterIcon = false,
  heigth = 56,
  disabled = false,
  keyboardType,
  autoCapitalize = 'sentences',
  maxDate = new Date(),
  error = '',
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // State to toggle password visibility

  return (
    <View
      style={[
        style,
        {
          gap: verticalScale(5),
        },
      ]}>
      {label && <CustomText fontFamily="medium">{label}</CustomText>}

      {/* INPUT + ICON CONTAINER */}
      <View
        style={[
          styles.container,
          type === 'search' && {gap: horizontalScale(10)},
          error ? {borderColor: COLORS.red} : {},
        ]}>
        {type === 'search' && (
          <VectorIcon type="AntDesign" name="search1" size={20} />
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          style={[{flex: 1, height: heigth}]}
          disabled={disabled ? disabled : type !== 'date'}>
          <View
            pointerEvents={type === 'date' ? 'none' : 'auto'}
            style={{flex: 1, opacity: disabled ? 0.7 : 1}}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              onChangeText={onChangeText}
              onBlur={onBlur}
              value={value}
              keyboardType={keyboardType}
               autoCapitalize={autoCapitalize}
              secureTextEntry={type === 'password' && !isPasswordVisible}
              placeholderTextColor={COLORS.placeholder}
            />
          </View>
        </TouchableOpacity>

        {type === 'password' && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <VectorIcon
              type="Feather"
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
            />
          </TouchableOpacity>
        )}

        {type === 'search' && isFilterIcon && (
          <VectorIcon type="AntDesign" name="filter" size={20} />
        )}
      </View>

      {/* ✅ ERROR TEXT BELOW INPUT */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: horizontalScale(15),
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.placeholder,
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(14),
    color: COLORS.black,
  },
  iconContainer: {
    marginLeft: 10,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
