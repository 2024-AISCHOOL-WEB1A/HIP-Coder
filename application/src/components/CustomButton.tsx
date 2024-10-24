import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  fontSize?: number;
  // marginBottom?: number;
  style?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  backgroundColor = '#9C59B5',
  textColor = 'white',
  borderRadius = 25,
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

export default CustomButton;
