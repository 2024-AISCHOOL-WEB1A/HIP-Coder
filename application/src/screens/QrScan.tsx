import React, { useEffect, useRef, useState } from 'react';
import { NativeModules, NativeEventEmitter, View, Text, Alert } from 'react-native';
import { requireNativeComponent } from 'react-native';
import axios from 'axios';
import { FLASK_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const { CameraModule } = NativeModules;
const PreviewView = requireNativeComponent('PreviewView');

const QRScannerScreen = () => {
  const navigation = useNavigation(); // 네비게이션 객체 가져오기
  const [isCameraActive, setCameraActive] = useState(false);
  const [isScanning, setScanning] = useState(false); // 스캔 상태를 추적하는 플래그
  const eventEmitter = useRef(new NativeEventEmitter(CameraModule)).current;

  useEffect(() => {
    const scanSuccessListener = eventEmitter.addListener('QRScanSuccess', (data) => {
      console.log("Received data from QRScanSuccess event:", data);
      
      if (!isScanning) { // 스캔이 활성화되지 않은 경우에만 처리
        const url = data.result || ''; // URL 추출
        if (url) {
          setScanning(true); // 스캔 중 상태로 변경
          Alert.alert('QR Code Scanned', `URL: ${url}`);
          sendUrlToBackend(url); // 스캔된 URL을 서버로 전송
        } else {
          Alert.alert('No URL detected');
        }
      }
    });

    const cameraCloseListener = eventEmitter.addListener('CameraCloseEvent', (data) => {
      console.log("Camera closed event received:", data);
      setCameraActive(false); // 카메라 비활성화
      navigation.navigate('Home'); // 홈으로 이동
    });

    // 컴포넌트가 마운트될 때 카메라 시작
    startScan();

    return () => {
      scanSuccessListener.remove();
      cameraCloseListener.remove(); // 리스너 정리
    };
  }, [eventEmitter, isScanning, navigation]); // navigation 추가

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
    CameraModule?.cancelScan(); // 카메라 종료 호출
    setCameraActive(false); // 카메라 취소 시 비활성화
    setScanning(false); // 스캔 상태 초기화
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isCameraActive && <PreviewView style={{ flex: 1, width: '100%' }} />}
      <Text>QR 코드를 스캔 중입니다...</Text>
    </View>
  );
};

export default QRScannerScreen;
