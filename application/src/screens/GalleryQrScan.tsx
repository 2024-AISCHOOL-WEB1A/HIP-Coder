import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Image, ScrollView, Linking, ActivityIndicator, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLASK_URL } from '@env';
import Header from '../components/Header';
import CustomButton from '../components/IJButton';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles'; // 스타일 가져오기

interface GalleryQrScanProps {
  navigation: any;
  route: any;
}

const GalleryQrScan: React.FC<GalleryQrScanProps> = ({ navigation, route }) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [isSafeUrl, setIsSafeUrl] = useState<boolean | null>(null);  // URL의 안전 여부 저장
  const [urlToOpen, setUrlToOpen] = useState<string>('');

  const checkIsLogin = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken);
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('accessToken');
    navigation.navigate('Login');
  };

  useEffect(() => {
    if (route.params && route.params.imageUri) {
      setSelectedImageUri(route.params.imageUri);
    }
    checkIsLogin();
  }, [route.params]);

  // 갤러리에서 이미지 선택
  const selectImageFromGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('이미지 선택이 취소되었습니다.');
        return;
      } else if (response.errorMessage) {
        console.log('에러: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          console.log('선택한 이미지 URI:', uri);
          setSelectedImageUri(uri);
        }
      }
    });
  };

  // 서버에 이미지 업로드
  const uploadImageToBackend = async () => {
    if (!selectedImageUri) {
      Alert.alert('이미지를 먼저 선택하세요!');
      return;
    }

    setLoading(true); // 로딩 시작

    const formData = new FormData();
    formData.append('photo', {
      uri: selectedImageUri,
      type: 'image/jpeg',
      name: `photo.${selectedImageUri.split('.').pop()}`,
    } as any);

    const accessToken = await AsyncStorage.getItem('accessToken');
    const headers = {
      'Content-Type': 'multipart/form-data',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    try {
      // Flask 서버로 이미지 업로드
      const response = await axios.post(`${FLASK_URL}/test`, formData, { headers });

      console.log('서버 응답 데이터:', response.data);

      // 서버 응답 데이터 처리
      if (response.data && response.data.status) {
        const { status, url } = response.data;
        setUrlToOpen(url);
        setIsSafeUrl(status === 'good');
        setShowWarningModal(true); // 검사 결과 모달 띄우기
      } else {
        Alert.alert('오류', '서버로부터 예상하지 못한 응답을 받았습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('네트워크 오류 발생:', error.message);
        Alert.alert('네트워크 오류', `서버에 연결할 수 없습니다. 오류 메시지: ${error.message}`);
      } else {
        console.error('알 수 없는 오류 발생:', error);
        Alert.alert('업로드 실패', '이미지 업로드 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // URL 열기 함수
  const openURL = async (inputUrl: string) => {
    let formattedURL = inputUrl.trim();

    const isValidURL = (url: string) => {
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
      Alert.alert('URL 열기 실패', `URL을 열 수 없습니다: ${formattedURL}`);
      console.error('URL 열기 오류:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} title="QR 이미지 검사" onBackPress={() => navigation.goBack()} />

      {/* 로딩 모달 */}
      <Modal visible={loading} transparent={true} animationType="fade">
        <View style={commonStyles.modalBackground}>
          <View style={commonStyles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#3182f6" />
            <Text style={commonStyles.textBlue}>이미지를 업로드 중입니다...</Text>
          </View>
        </View>
      </Modal>

      {/* URL 안전성 검사 결과 모달 */}
      <Modal visible={showWarningModal} transparent={true} animationType="fade" onRequestClose={() => setShowWarningModal(false)}>
        <View style={commonStyles.modalBackground}>
          <View style={commonStyles.warningModalWrapper}>
            {isSafeUrl ? (
              <>
                <Image source={{ uri: 'https://jsh-1.s3.ap-northeast-2.amazonaws.com/hipcoder/Safe.png'}}
                 style={commonStyles.warningImage} />
                <Text style={commonStyles.textBlackCenter}>이 URL은 안전한 URL입니다.{'\n'}이동하시겠습니까?</Text>
                <View style={commonStyles.modalButton}>
                  <TouchableOpacity style={commonStyles.modalButtonGray} onPress={() => setShowWarningModal(false)}>
                    <Text style={commonStyles.textGrayMediumB}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={commonStyles.modalButtonBlue}
                    onPress={() => {
                      openURL(urlToOpen);
                      setShowWarningModal(false);
                    }}
                  >
                    <Text style={commonStyles.textWhiteMediumB}>이동</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Image source={{ uri: 'https://jsh-1.s3.ap-northeast-2.amazonaws.com/hipcoder/Danger.png'}}
                 style={commonStyles.warningImage} />
                <Text style={commonStyles.textBlackCenter}>이 URL은 피싱 위험이 있습니다.{'\n'}그래도 접속하시겠습니까?</Text>
                <View style={commonStyles.modalButton}>
                  <TouchableOpacity style={commonStyles.modalButtonRed} onPress={() => setShowWarningModal(false)}>
                    <Text style={commonStyles.textWhiteMediumB}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={commonStyles.modalButtonGray}
                    onPress={() => {
                      openURL(urlToOpen);
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

      <View style={styles.mainContent}>
        {selectedImageUri ? (
          <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
        ) : (
          <CustomButton title="이미지 선택하기" onPress={selectImageFromGallery} />
        )}
      </View>

      {selectedImageUri && (
        <View style={styles.buttonContainer}>
          <CustomButton title="이미지 변경하기" onPress={selectImageFromGallery} />
          <CustomButton title="선택한 이미지 검사하기" onPress={uploadImageToBackend} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  previewImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: '#F5F5F5',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default GalleryQrScan;
