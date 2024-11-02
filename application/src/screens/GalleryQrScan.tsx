import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary, Asset, ImagePickerResponse } from 'react-native-image-picker';
import axios from 'axios';

interface GalleryQrScanProps {
  navigation: any; // 타입을 더 구체적으로 지정할 수 있다면 지정하는 것이 좋습니다.
  csrfToken: string;
}

const GalleryQrScan: React.FC<GalleryQrScanProps> = ({ navigation, csrfToken }) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  // 갤러리에서 이미지 선택하기
  const selectImageFromGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('이미지 선택이 취소되었습니다.');
        if (navigation.canGoBack()) {
          navigation.goBack(); // 이미지 선택이 취소되면 이전 화면으로 돌아감
        } else {
          console.warn('돌아갈 화면이 없습니다.');
        }
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

  // 컴포넌트가 마운트될 때 갤러리 선택 호출
  useEffect(() => {
    selectImageFromGallery();
  }, []);

  // 이미지 백엔드로 전송하기
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
    } as any); // 타입스크립트에서 FormData에 파일을 추가할 때 타입 에러가 발생할 수 있어 'as any'로 처리

    try {
      const response = await axios.post(
        'http://220.95.41.232:5000/test', // 서버 URL
        formData, // 전송할 데이터
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );

      Alert.alert('업로드 성공', `서버 응답: ${JSON.stringify(response.data)}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('네트워크 오류 발생:', error.message);
        Alert.alert('네트워크 오류', `서버에 연결할 수 없습니다. 오류 메시지: ${error.message}`);
      } else {
        console.error('알 수 없는 오류 발생:', error);
        Alert.alert('업로드 실패', '이미지 업로드 중 알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>갤러리 QR 코드 검사</Text>
      
      {selectedImageUri && (
        <TouchableOpacity style={styles.button} onPress={uploadImageToBackend}>
          <Text style={styles.buttonText}>선택한 이미지 업로드</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#9C59B5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GalleryQrScan;
