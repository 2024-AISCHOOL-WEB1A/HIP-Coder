import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import CustomButton from '../components/CustomButton';

const QrScan = () => {
  const navigation = useNavigation();

  const startScanning = () => {
    console.log("QR 스캔 시작");
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>QR 스캔</Text>
      <CustomButton title="QR 스캔" onPress={startScanning} />
    </View>
  );
};

export default QrScan;