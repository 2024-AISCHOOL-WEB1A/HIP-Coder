


import React, { useEffect, useRef, useState } from 'react';
import { NativeModules, NativeEventEmitter, Button, View, Text, Alert } from 'react-native';
import { requireNativeComponent } from 'react-native';
import axios from 'axios';
import { FLASK_URL } from '@env';

const { CameraModule } = NativeModules;
const PreviewView = requireNativeComponent('PreviewView');

const QRScannerScreen = () => {
  const [isCameraActive, setCameraActive] = useState(false);
  const [isScanning, setScanning] = useState(false); // 추가: 스캔 상태를 추적하는 플래그
  const eventEmitter = useRef(new NativeEventEmitter(CameraModule)).current;

  useEffect(() => {
    const scanSuccessListener = eventEmitter.addListener('QRScanSuccess', (data) => {
      console.log("Received data from QRScanSuccess event:", data);
      
      if (!isScanning) { // 스캔이 활성화되지 않은 경우에만 처리
        const url = data.result || ''; // URL 추출
        if (url) {
          setScanning(true); // 스캔 중 상태로 변경
          Alert.alert('QR Code Scanned', `URL: ${url}`);
          setCameraActive(false); // 스캔 후 카메라 비활성화
          sendUrlToBackend(url); // 스캔된 URL을 서버로 전송
        } else {
          Alert.alert('No URL detected');
        }
      }
    });

    return () => {
      scanSuccessListener.remove();
    };
  }, [eventEmitter, isScanning]); // isScanning 의존성 추가

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
    setScanning(false); // 스캔 상태 초기화
    CameraModule?.startCamera();
  };

  const cancelScan = () => {
    CameraModule?.cancelScan();
    setCameraActive(false); // 카메라 취소 시 비활성화
    setScanning(false); // 스캔 상태 초기화
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



