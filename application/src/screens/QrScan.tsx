import React, { useEffect, useRef, useState } from 'react';
import { NativeModules, NativeEventEmitter, Button, View, Text, Alert } from 'react-native';
import { requireNativeComponent } from 'react-native';
import axios from 'axios';

import { FLASK_URL } from '@env';





const { CameraModule } = NativeModules;
const PreviewView = requireNativeComponent('PreviewView');

const QRScannerScreen = () => {
  const [isCameraActive, setCameraActive] = useState(false);
  const eventEmitter = useRef(new NativeEventEmitter(CameraModule)).current;

  useEffect(() => {
    const scanSuccessListener = eventEmitter.addListener('QRScanSuccess', (url) => {
      Alert.alert('QR Code Scanned', `URL: ${url}`);
      setCameraActive(false); 
      sendUrlToBackend(url); // 스캔된 URL을 서버로 전송
    });

    return () => {
      scanSuccessListener.remove();
    };
  }, [eventEmitter]);

  const sendUrlToBackend = async (url) => {
    try {
      const response = await axios.post(`${FLASK_URL}/scan`, { url });
      const { status, message } = response.data;
      Alert.alert('URL Classification', message);
    } catch (error) {
      console.error('Error sending URL:', error);
      Alert.alert('Error', 'QR 코드 URL을 분류하는 중 오류가 발생했습니다.');
    }
  };

  const startScan = () => {
    setCameraActive(true);
    CameraModule?.startCamera();
  };

  const cancelScan = () => {
    CameraModule?.cancelScan();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Scan QR Code" onPress={startScan} />
      {isCameraActive && <PreviewView style={{ flex: 1, width: '100%' }} />}
      <Button title="Cancel Scan" onPress={cancelScan} disabled={!isCameraActive} />
      <Text>Press the button to start scanning a QR code</Text>
    </View>
  );
};

export default QRScannerScreen;
