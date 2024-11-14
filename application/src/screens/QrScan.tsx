import React, { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter, View, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FLASK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { CameraModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(CameraModule);

const QRScannerScreen = () => {
  const navigation = useNavigation();
  const [isCameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    console.log("useEffect: 이벤트 리스너 설정 중...");
    console.log("CameraModule 확인:", CameraModule);

    const handleQRScanSuccess = (data) => {
      const url = data.result;
      console.log("handleQRScanSuccess: QR 코드 스캔 성공 - URL:", url);
      Alert.alert('QR 코드 스캔', `URL: ${url}`);
      sendUrlToBackend(url);
    };

    const handleCameraClose = () => {
      console.log("handleCameraClose: 카메라 종료 이벤트 수신");
      setCameraActive(false);
      navigation.navigate('Home');
    };

    const qrScanListener = eventEmitter.addListener('QRScanSuccess', handleQRScanSuccess);
    const cameraCloseListener = eventEmitter.addListener('CameraCloseEvent', handleCameraClose);

    console.log("useEffect: 이벤트 리스너 추가 완료");

    // 카메라 자동 시작
    startScan();

    return () => {
      console.log("useEffect Cleanup: 모든 이벤트 리스너 제거 중...");
      qrScanListener.remove();
      cameraCloseListener.remove();
      stopScan();
    };
  }, []); // 한 번만 실행

  const sendUrlToBackend = async (url) => {
    console.log("sendUrlToBackend: 서버로 URL 전송 시도 - URL:", url);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("sendUrlToBackend: AsyncStorage에서 토큰 가져오기 성공 - 토큰:", token);
      const response = await axios.post(`${FLASK_URL}/scan`, {
        url: url,
        category: 'QR',
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const { message } = response.data;
      console.log("sendUrlToBackend: 서버 응답 메시지:", message);
      Alert.alert('URL 분류 결과', message);
    } catch (error) {
      console.error('sendUrlToBackend: 서버 전송 오류:', error);
      Alert.alert('오류', 'QR 코드 URL을 분류하는 중 오류가 발생했습니다.');
    }
  };

  const startScan = async () => {
    if (isCameraActive) {
      console.log("startScan: 카메라가 이미 활성화 상태입니다.");
      return;
    }

    try {
      console.log("startScan: 카메라 초기화 시도");
      await CameraModule.resetCamera();
      console.log("startScan: 카메라 초기화 완료");

      console.log("startScan: 카메라 시작 시도");
      await CameraModule.startCamera();
      console.log("startScan: 카메라 시작 성공");
      setCameraActive(true);
    } catch (error) {
      console.error("startScan: 카메라 시작 오류:", error);
      Alert.alert("오류", "카메라를 시작하는 중 오류가 발생했습니다.");
    }
  };

  const stopScan = async () => {
    if (!isCameraActive) {
      console.log("stopScan: 카메라가 이미 비활성화 상태입니다.");
      return;
    }

    try {
      console.log("stopScan: 카메라 종료 시도");
      await CameraModule.cancelScan();
      console.log("stopScan: 카메라 종료 성공");
      setCameraActive(false);
    } catch (error) {
      console.error("stopScan: 카메라 종료 오류:", error);
      Alert.alert("오류", "카메라를 종료하는 중 오류가 발생했습니다.");
    }
  };

  console.log("QRScannerScreen: 컴포넌트 렌더링 중");

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isCameraActive ? (
        <Text>QR 코드를 스캔 중입니다...</Text>
      ) : (
        <Text>카메라가 비활성화되었습니다.</Text>
      )}
    </View>
  );
};

export default QRScannerScreen;
