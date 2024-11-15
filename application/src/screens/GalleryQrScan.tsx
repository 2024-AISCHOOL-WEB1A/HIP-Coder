import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLASK_URL } from '@env';
import Header from '../components/Header';
import CustomButton from '../components/IJButton';
import { useNavigation } from '@react-navigation/native';

interface GalleryQrScanProps {
  navigation: any;
  route: any; // route로 params를 받아오기 위해 추가
}

const GalleryQrScan: React.FC<GalleryQrScanProps> = ({ navigation, route }) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const nav = useNavigation();

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
    checkIsLogin()
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
      // 이미지 선택이 취소되었을 때, navigation.goBack()을 호출하지 않고 페이지를 유지
      return;  // navigation.goBack() 제거
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
  
    const formData = new FormData();
    formData.append('photo', {
      uri: selectedImageUri,
      type: 'image/jpeg',
      name: `photo.${selectedImageUri.split('.').pop()}`,
    } as any);
  
    const accessToken = await AsyncStorage.getItem('accessToken');
    const headers = {
      'Content-Type': 'multipart/form-data',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    };
  
    console.log('Authorization 헤더에 추가된 JWT 토큰:', headers.Authorization);
  
    try {
      // Flask 서버로 이미지 업로드
      const response = await axios.post(
        `${FLASK_URL}/test`,
        formData,
        { headers }
      );
  
      console.log('서버 응답 데이터:', response.data);
  
      // 서버 응답 데이터 구조 확인
      if (response.data) {
        console.log('서버 응답 내 메시지:', response.data.message);
        console.log('서버 응답 내 상태:', response.data.status);
      }
  
      // 서버 응답에 따른 결과 처리
      if (response.data && response.data.status) {
        if (response.data.status === 'good') {
          Alert.alert('정상', '이 QR 이미지는 안전합니다.', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]);
        } else if (response.data.status === 'bad') {
          Alert.alert('위험', '이 QR 이미지는 안전하지 않을 수 있습니다.', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]);
        } else {
          Alert.alert('업로드 실패', '예측 결과를 확인할 수 없습니다.', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
          ]);
        }
      } else {
        Alert.alert('업로드 실패', '서버로부터 예상하지 못한 응답을 받았습니다.', [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('네트워크 오류 발생:', error.message);
        Alert.alert('네트워크 오류', `서버에 연결할 수 없습니다. 오류 메시지: ${error.message}`, [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        console.error('알 수 없는 오류 발생:', error);
        Alert.alert('업로드 실패', '이미지 업로드 중 알 수 없는 오류가 발생했습니다.', [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} title="QR 이미지 검사" onBackPress={() => navigation.goBack()} />
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
    backgroundColor: '#FFFFFF', // History 페이지의 배경색에 맞춰 흰색
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
    backgroundColor: '#F5F5F5', // History 페이지의 이미지 배경색에 맞춰 밝은 색으로 설정
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

});

export default GalleryQrScan;
