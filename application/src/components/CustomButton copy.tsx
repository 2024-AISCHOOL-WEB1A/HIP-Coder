// CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  fontSize?: number;
  // marginBottom?: number;
  style?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  backgroundColor = '#7a87c9',
  textColor = 'white',
  borderRadius = 20,
  paddingVertical = 5,
  paddingHorizontal = 20,
  fontSize = 16,
  // marginBottom = 20,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
        //   width,
        //   height,
          backgroundColor,
          borderRadius,
          paddingVertical,
          paddingHorizontal,
          // marginBottom
        },
          style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: textColor, fontSize }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    color:'#7a87c9',
    elevation: 3, // 안드로이드의 그림자 효과
    shadowColor: '#000', // iOS에서의 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // iOS에서 그림자 오프셋
    shadowOpacity: 0.8, // iOS에서 그림자 투명도
    shadowRadius: 2, // iOS에서 그림자 반경
  },
  buttonText: {
    // fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomButton;