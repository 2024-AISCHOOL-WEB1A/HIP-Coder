import React, { useState, useEffect } from 'react';
import { NativeModules, NativeEventEmitter, View, Text, Alert, StyleSheet, Linking, ActivityIndicator, Modal, Image, TouchableOpacity } from 'react-native';
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
  const [loading, setLoading] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isSafeUrl, setIsSafeUrl] = useState<boolean | null>(null);
  const [formattedURL, setFormattedURL] = useState<string>('');

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
        stopScan();
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
    CameraModule.cancelScan();

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
    setLoading(true);
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
      const { status } = response.data;

      // 결과 상태 업데이트
      setFormattedURL(formattedURL);
      if (status === 'good') {
        setIsSafeUrl(true);
      } else if (status === 'bad') {
        setIsSafeUrl(false);
      } else {
        Alert.alert('오류', '예측 결과를 확인할 수 없습니다.');
      }
    } catch (error) {
      console.error('sendUrlToBackend: 서버 전송 오류:', error);
      Alert.alert('오류', 'QR 코드 URL을 분류하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setShowWarningModal(true); // 모달 표시
    }
  };

  const openURL = async (inputUrl) => {
    try {
      await Linking.openURL(inputUrl);
    } catch (error) {
      Alert.alert(`URL을 열 수 없습니다: ${inputUrl}`);
      console.error('URL 열기 오류:', error);
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
      <Modal visible={loading} transparent={true} animationType="fade">
        <View style={commonStyles.modalBackground}>
          <View style={commonStyles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#3182f6" />
            <Text style={commonStyles.loadingText}>URL을 확인 중입니다.</Text>
          </View>
        </View>
      </Modal>

      {/* 결과 모달 */}
      <Modal
        visible={showWarningModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWarningModal(false)}
      >
        <View style={commonStyles.modalBackground}>
          <View style={commonStyles.warningModalWrapper}>
            {isSafeUrl ? (
              <>
                <Image
                  source={{ uri: 'https://jsh-1.s3.ap-northeast-2.amazonaws.com/hipcoder/Safe.png' }}
                  style={commonStyles.warningImage}
                />
                <Text style={commonStyles.textBlackCenter}>이 URL은 안전합니다. 이동하시겠습니까?</Text>
                <View style={commonStyles.modalButton}>
                  <TouchableOpacity
                    style={commonStyles.modalButtonGray}
                    onPress={() => setShowWarningModal(false)}
                  >
                    <Text style={commonStyles.textGrayMediumB}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={commonStyles.modalButtonBlue}
                    onPress={() => {
                      openURL(formattedURL);
                      setShowWarningModal(false);
                    }}
                  >
                    <Text style={commonStyles.textWhiteMediumB}>이동</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Image
                  source={{ uri: 'https://jsh-1.s3.ap-northeast-2.amazonaws.com/hipcoder/Danger.png' }}
                  style={commonStyles.warningImage}
                />
                <Text style={commonStyles.textBlackCenter}>이 URL은 위험할 수 있습니다. 접속하시겠습니까?</Text>
                <View style={commonStyles.modalButton}>
                  <TouchableOpacity
                    style={commonStyles.modalButtonRed}
                    onPress={() => setShowWarningModal(false)}
                  >
                    <Text style={commonStyles.textWhiteMediumB}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={commonStyles.modalButtonGray}
                    onPress={() => {
                      openURL(formattedURL);
                      setShowWarningModal(false);
                    }}
                  >
                    <Text style={commonStyles.textGrayMediumB}>이동</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
