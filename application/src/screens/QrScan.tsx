import React, { useState } from 'react';
import { View, Text, Button ,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import CustomButton from '../components/CustomButton';
import { RNCamera, BarCodeReadEvent  } from 'react-native-camera'; //추가
import api from '../../axios.tsx'; //추가
//import UrlCheck from './UrlCheck';


const QrScan = ({ csrfToken }: { csrfToken: string }) => {
  const navigation = useNavigation();
  const [scannedURL, setScannedURL] = useState('');
  const [scanning,setScanning] = useState(false);

  const checkurl = async (url : string) => {//추가
    try {
      const response = await api.post('/urltest', {url}, {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });
      Alert.alert('검사 결과', response.data.message);
    } catch (error) {
      console.error('URL 검사 오류: ', error);
      Alert.alert('오류', 'URL 검사가 실패했습니다');
    }
  };

  const isValidURL = (url: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // 3번
      '((([a-z0-9\\-]+)\\.)+[a-z]{2,}|'+ // 2번 도메인
      'localhost|'+ // 혹은 localhost
      '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // 혹은 IP 주소
      '\\[?[a-f0-9]*:[a-f0-9:%.]*\\]?)' + // 1번
      '(\\:\\d+)?(\\/[-a-z0-9%_.~+]*)*' + // 포트
      '(\\?[;&a-z0-9%_.~+=-]*)?' + // 쿼리
      '(\\#[-a-z0-9_]*)?$','i'); //
    return !!pattern.test(url);
  };
  
  const handelQRCodeRead = async (event: BarCodeReadEvent) => {
    const { data } = event;
    if (isValidURL(data)) {
      setScannedURL(data);
      await checkurl(data);
    } else {
      Alert.alert('오류', 'QR코드의 정보가 URL이 아님');
    }
  };
  

  const startScanning = () => {
    console.log("QR 스캔 시작");
    setScanning(true);
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>QR 스캔</Text>
      {scanning ? (
        <RNCamera
          style={{ flex: 1, width: '100%' }}
          onBarCodeRead={handelQRCodeRead}
          captureAudio={false}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>QR 코드를 스캔하세요!</Text>
            {scannedURL ? (
              <Text style={{ marginTop: 20 }}>스캔한 URL: {scannedURL}</Text>
            ) : null}
          </View>
        </RNCamera>
      ) : (
        <CustomButton title="QR 스캔" onPress={startScanning} />
      )}
    </View>
  );
};

export default QrScan;






