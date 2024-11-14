import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface HEButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  borderColor?: number;
  fontFamily?: string;
  fontSize?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  // marginBottom?: number;
  style?: object;
}

const HEButton: React.FC<HEButtonProps> = ({
  title,
  onPress,
  backgroundColor = '#3182f6',
  textColor = 'white',
  borderRadius = 25,
  borderColor = '#3182f6',
  fontFamily = 'Pretendard-Medium',
  fontSize = 16,
  paddingVertical = 5,
  paddingHorizontal = 20,
  // marginBottom = 20,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: '100%',
          height: 55,
          backgroundColor,
          textColor,
          borderRadius,
          borderColor,
          fontFamily,
          fontSize,
          paddingVertical,
          paddingHorizontal,

          // backgroundColor,
          // borderRadius,
          // paddingVertical,
          // paddingHorizontal,
          // // marginBottom
        },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { fontFamily, color: textColor, fontSize }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonText: {
    textAlign: 'center',
  },
});

export default HEButton;
