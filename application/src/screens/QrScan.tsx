import React, { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter, View, Text, Alert, Linking, StyleSheet } from 'react-native';
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

    // QR 코드 스캔 성공 처리
    const handleQRScanSuccess = (data) => {
      const url = data.result;
      console.log("handleQRScanSuccess: QR 코드 스캔 성공 - URL:", url);
      sendUrlToBackend(url);
    };

    // 카메라 종료 이벤트 처리
    const handleCameraClose = () => {
      console.log("handleCameraClose: 카메라 종료 이벤트 수신");
      setCameraActive(false);
      navigation.navigate('Home');
    };

    // 이벤트 리스너 등록
    const qrScanListener = eventEmitter.addListener('QRScanSuccess', handleQRScanSuccess);
    const cameraCloseListener = eventEmitter.addListener('CameraCloseEvent', handleCameraClose);

    // 카메라 자동 시작
    startScan();

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거 및 카메라 종료
      console.log("useEffect Cleanup: 모든 이벤트 리스너 제거 중...");
      qrScanListener.remove();
      cameraCloseListener.remove();
      stopScan();
    };
  }, []);

  // 서버에 URL 전송
  const sendUrlToBackend = async (inputUrl) => {
    console.log("sendUrlToBackend: 서버로 URL 전송 시도 - URL:", inputUrl);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      let formattedURL = inputUrl.trim();

      // URL 포맷 검사 및 보정
      if (!/^https?:\/\//i.test(formattedURL)) {
        formattedURL = `https://www.${formattedURL}`;
      }

      // 서버 요청
      const response = await axios.post(`${FLASK_URL}/scan`, {
        url: formattedURL,
        category: 'QR',
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('서버 응답 데이터:', response.data);
      const { status, message, url } = response.data;

      // 응답 상태에 따른 처리
      if (status === 'good') {
        Alert.alert('알림', '안전한 사이트입니다! 링크로 이동합니다.', [
          { text: 'OK', onPress: () => openURL(url) }
        ]);
      } else if (status === 'bad') {
        Alert.alert(
          '경고', '이 URL은 위험할 수 있습니다. 그래도 접속하시겠습니까?',
          [
            { text: 'URL 열기', onPress: () => openURL(url) },
            { text: '취소', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('오류', '예측 결과를 확인할 수 없습니다.');
      }
    } catch (error) {
      console.error('sendUrlToBackend: 서버 전송 오류:', error);
      Alert.alert('오류', 'QR 코드 URL을 분류하는 중 오류가 발생했습니다.');
    }
  };

  // URL 열기 함수
  const openURL = async (inputUrl) => {
    let formattedURL = inputUrl.trim();

    const isValidURL = (url) => {
      const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
      return urlRegex.test(url);
    };

    if (!isValidURL(formattedURL)) {
      Alert.alert('잘못된 URL 형식입니다.');
      return;
    }

    if (!/^https?:\/\//i.test(formattedURL)) {
      formattedURL = `https://${formattedURL}`;
    }

    try {
      await Linking.openURL(formattedURL);
    } catch (error) {
      Alert.alert(`URL을 열 수 없습니다: ${formattedURL}`);
      console.error('URL 열기 오류:', error);
    }
  };

  // 카메라 시작 함수
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

  // 카메라 종료 함수
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
    <View style={styles.container}>
      {isCameraActive ? (
        <Text style={styles.text}>QR 코드를 스캔 중입니다...</Text>
      ) : (
        <Text style={styles.text}>카메라가 비활성화되었습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default QRScannerScreen;
