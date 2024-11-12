import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLASK_URL } from '@env';
import Header from '../components/Header';

interface GalleryQrScanProps {
  navigation: any;
}

interface ScanHistory {
  id: string;
  date: string;
  imageUri: string;
  status: string;
}

const GalleryQrScan: React.FC<GalleryQrScanProps> = ({ navigation }) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistory[]>([]);

  const selectImageFromGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('이미지 선택이 취소되었습니다.');
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

  useEffect(() => {
    selectImageFromGallery();
  }, []);

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
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
    };

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${FLASK_URL}/test`,
        formData,
        {
          headers,   
        }
      );

      console.log('서버 응답 데이터:', response.data);
      if (response.data.qrCodeData) {
        const url = response.data.qrCodeData;
        // /scan 엔드포인트에 토큰과 user_idx 포함하여 요청
        const scanResponse = await axios.post(
          `${FLASK_URL}/scan`,
          { url, category: 'IMG', user_idx },  // user_idx를 바디에 추가
          { headers }  // JWT 토큰이 포함된 헤더
        );


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

      const newScan: ScanHistory = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        imageUri: selectedImageUri,
        status: response.data.result || '검사 완료',
      };

      setScanHistory(prevHistory => [newScan, ...prevHistory]);
      Alert.alert('검사 완료', `결과: ${response.data.result || '검사가 완료되었습니다.'}`);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Header />

      <View style={styles.mainContent}>
        {selectedImageUri ? (
          <>
            <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />

            <TouchableOpacity style={styles.button} onPress={selectImageFromGallery}>
              <Text style={styles.buttonText}>이미지 변경하기</Text>
            </TouchableOpacity>

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

      {scanHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>검사 이력</Text>
          {scanHistory.map((scan) => (
            <View key={scan.id} style={styles.historyItem}>
              <Image source={{ uri: scan.imageUri }} style={styles.historyImage} />
              <View style={styles.historyInfo}>
                <Text style={styles.historyStatus}>{scan.status}</Text>
                <Text style={styles.historyDate}>{formatDate(scan.date)}</Text>
              </View>
              <Icon name="chevron-forward-outline" size={20} color="#9C59B5" />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  mainContent: {
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#9C59B5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  previewImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  historySection: {
    padding: 20,
  },
  historyTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#333333',
    fontFamily: 'Pretendard-Bold',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0E6F5',
  },
  historyImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyStatus: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
    fontFamily: 'Pretendard-Regular',
  },
  historyDate: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Pretendard-Regular',
  },
});

export default GalleryQrScan;
