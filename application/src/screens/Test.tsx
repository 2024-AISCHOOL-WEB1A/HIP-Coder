import React, { useState } from 'react';
import { View, Button, Alert, TextInput, Linking } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../axios';
import { AxiosError } from 'axios';
import { RootStackParamList } from '../../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  csrfToken: string | null; // CSRF 토큰을 props로 받음
}

const Test: React.FC<Props> = ({ navigation, csrfToken }) => {
  const [inputValue, setInputValue] = useState<string>('');  // 일반 데이터 상태
  const [urlValue, setUrlValue] = useState<string>('');  // URL 데이터 상태

  // CSRF 토큰을 헤더에 포함하여 데이터를 전송하는 함수
  const sendData = async () => {
    try {
      if (!csrfToken) {
        Alert.alert('오류', 'CSRF 토큰을 먼저 가져오세요.');
        return;
      }

      const res = await api.post(
        '/submit', 
        { data: inputValue }, 
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      );
      Alert.alert('서버 응답', res.data.message);
    } catch (error: unknown) {
      console.error('API 호출 오류:', error);

      if (error instanceof AxiosError) {
        if (error.response) {
          console.error('서버 응답 오류:', error.response.data);
        } else if (error.request) {
          console.error('요청이 전송되었으나 응답이 없음:', error.request);
        } else {
          console.error('요청 설정 에러:', error.message);
        }
      } else {
        console.error('알 수 없는 에러:', error);
      }

      Alert.alert('오류', '데이터 전송에 실패했습니다.');
    }
  };

  /** URL 검사 및 처리 함수 */
  const urlData = async () => {
    console.log(urlValue);
    try {
      const res = await api.post(
        '/scan/urltest', 
        { url: urlValue },
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      );

      if (res.data.message === '안전') {
        openURL(urlValue);
      } else if (res.data.message === '위험') {
        Alert.alert(
          '경고', '이 URL은 위험할 수 있습니다. 그래도 접속하시겠습니까?',
          [
            { text: '취소', style: 'cancel' },
            { text: '접속', onPress: () => openURL(urlValue) }
          ]
        );
      } else if (res.data.message === '잘못된 url 형식입니다.') {
        Alert.alert('서버 응답', 'URL을 확인 해주세요.');
      }
    } catch (error) {
      console.error('URL 검사 오류:', error);
      Alert.alert('오류', 'URL 검사에 실패했습니다.');
    }
  };

  const openURL = async (url: string) => {
    let formattedURL = url.trim(); // 공백 제거
 
    // URL이 http:// 또는 https://로 시작하는지 확인
    if (!/^https?:\/\//i.test(formattedURL)) {
       formattedURL = `http://${formattedURL}`; // http:// 또는 https://가 없을 때만 추가
    }
 
    const supported = await Linking.canOpenURL(formattedURL);
    if (supported) {
       await Linking.openURL(formattedURL); // URL을 기본 브라우저에서 열기
    } else {
       Alert.alert(`URL을 열 수 없습니다: ${formattedURL}`);
    }
 };
 
  

  return (
    <View>
      <TextInput
        placeholder="값을 입력하세요"
        value={inputValue}
        onChangeText={setInputValue}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
      <Button
        title="데이터 전송"
        onPress={sendData}
      />
      <TextInput
        placeholder="URL 입력"
        value={urlValue}
        onChangeText={setUrlValue}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
      <Button 
        title="QR 테스트"
        onPress={urlData}
      />
    </View>
  );
};

export default Test;
