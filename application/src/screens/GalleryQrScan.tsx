import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { launchImageLibrary, Asset, ImagePickerResponse } from 'react-native-image-picker';
import axios from 'axios';
import { useCsrf } from '../../context/CsrfContext';
import { FLASK_URL } from '@env';
interface GalleryQrScanProps {
  navigation: any; // 타입을 더 구체적으로 지정할 수 있다면 지정하는 것이 좋습니다.
}

const GalleryQrScan: React.FC<GalleryQrScanProps> = ({ navigation }) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const { csrfToken } = useCsrf();

  // 갤러리에서 이미지 선택하기
  const selectImageFromGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('이미지 선택이 취소되었습니다.');
        // 이미지 선택 취소 시 이전 선택한 이미지를 유지
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
        //'http://220.95.41.232:5000/test', // 서버 URL
        `${FLASK_URL}/test`,
        formData, // 전송할 데이터
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );

      console.log('서버 응답 데이터:', response.data);
      console.log('서버 응답 데이터:', response.data.status);

      if (response.data.qrCodeData) {
        const url = response.data.qrCodeData;
        const scanResponse = await axios.post(`${FLASK_URL}/scan`, { url });

        if (scanResponse.data.status === 'good') {
          Alert.alert('업로드 성공', `서버 응답: 이 URL은 안전합니다. (${scanResponse.data.url})`);
        } else if (scanResponse.data.status === 'bad') {
          Alert.alert('업로드 성공', `서버 응답: 이 URL은 보안 위험이 있을 수 있습니다. (${scanResponse.data.url})`);
        } else {
          Alert.alert('업로드 실패', '예측 결과를 확인할 수 없습니다.');
        }
      } else {
        Alert.alert('업로드 실패', 'QR 코드 데이터가 없습니다.');
      }
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

      {selectedImageUri ? (
        <>
          {/* 이미지 미리보기 */}
          <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />

          {/* 이미지 변경 버튼 */}
          <TouchableOpacity style={styles.button} onPress={selectImageFromGallery}>
            <Text style={styles.buttonText}>이미지 변경하기</Text>
          </TouchableOpacity>

          {/* 이미지 업로드 버튼 */}
          <TouchableOpacity style={styles.button} onPress={uploadImageToBackend}>
            <Text style={styles.buttonText}>선택한 이미지 업로드</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={selectImageFromGallery}>
          <Text style={styles.buttonText}>이미지 선택하기</Text>
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
  previewImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
});

export default GalleryQrScan;