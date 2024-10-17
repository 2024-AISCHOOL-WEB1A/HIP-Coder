import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';

const QrScan = () => {
  const navigation = useNavigation();

  const startScanning = () => {
    console.log("QR 스캔 시작");
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>QR Scan</Text>
      <Button title="Start Scanning" onPress={startScanning} />
    </View>
  );
};

export default QrScan;