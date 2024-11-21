import React, { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter, View, Text, Alert, StyleSheet, Linking, ActivityIndicator, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FLASK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyles from '../styles/commonStyles';

const { CameraModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(CameraModule);

const QRScannerScreen = () => {
  const navigation = useNavigation();
  const [isCameraActive, setCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    console.log("useEffect: 이벤트 리스너 설정 중...");
    console.log("CameraModule 확인:", CameraModule);

    const qrScanListener = eventEmitter.addListener('QRScanSuccess', handleQRScanSuccess);
    const cameraCloseListener = eventEmitter.addListener('CameraCloseEvent', handleCameraClose);

    startScan();

    return () => {
      console.log("useEffect Cleanup: 모든 이벤트 리스너 제거 중...");
      qrScanListener.remove();
      cameraCloseListener.remove();
      if (isCameraActive) {
        stopScan(); // 활성 상태일 때만 카메라 종료
      }
    };
  }, []);

  const handleQRScanSuccess = async (data) => {
    if (isScanning) {
      console.log("handleQRScanSuccess: 스캔 처리 중 - 추가 스캔 차단");
      return;
    }

    setIsScanning(true);
    const url = data.result;
    console.log("handleQRScanSuccess: QR 코드 스캔 성공 - URL:", url);

    await sendUrlToBackend(url);

    console.log("handleQRScanSuccess: 카메라 종료 요청");
    CameraModule.cancelScan(); // 카메라 종료 요청

    console.log("handleQRScanSuccess: Home 화면으로 이동 시작");
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
    console.log("handleQRScanSuccess: Home 화면으로 이동 완료");
  };

  const handleCameraClose = () => {
    console.log("handleCameraClose: 카메라 종료 이벤트 수신");
    stopScan();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
    console.log("handleCameraClose: Home 화면으로 이동 완료");
  };

  const sendUrlToBackend = async (inputUrl) => {
    setLoading(true); // 로딩 활성화
    console.log("sendUrlToBackend: 서버로 URL 전송 시도 - URL:", inputUrl);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      let formattedURL = inputUrl.trim();

      if (!/^https?:\/\//i.test(formattedURL)) {
        formattedURL = `https://${formattedURL}`;
      }

      const response = await axios.post(`${FLASK_URL}/scan`, {
        url: formattedURL,
        category: 'QR',
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('서버 응답 데이터:', response.data);
      const { status, url } = response.data;

      setScanResult({ status, url });

      if (status === 'good') {
        Alert.alert('알림', '안전한 사이트입니다! 링크로 이동합니다.', [
          { text: 'OK', onPress: () => Linking.openURL(url) }
        ]);
      } else if (status === 'bad') {
        Alert.alert(
          '경고', '이 URL은 위험할 수 있습니다. 그래도 접속하시겠습니까?',
          [
            { text: 'URL 열기', onPress: () => Linking.openURL(url) },
            { text: '취소', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('오류', '예측 결과를 확인할 수 없습니다.');
      }
    } catch (error) {
      console.error('sendUrlToBackend: 서버 전송 오류:', error);
      Alert.alert('오류', 'QR 코드 URL을 분류하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 비활성화
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

  return (
    <View style={styles.container}>
      {/* 검사 중 모달 */}
      <Modal
        visible={loading}
        transparent={true}
        animationType="fade"
      >
        <View style={commonStyles.modalBackground}>
          <View style={commonStyles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#3182f6" />
            <Text style={commonStyles.loadingText}>URL을 확인 중입니다.</Text>
          </View>
        </View>
      </Modal>

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