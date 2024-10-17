import React, { useState } from 'react';
import { View, Button, Alert, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // 추가
import api from '../../axios';
import { AxiosError } from 'axios'; // AxiosError 타입 가져오기
import { RootStackParamList } from '../../types';
import Cookies from '@react-native-cookies/cookies'; // 쿠키 가져오기

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const Test: React.FC<Props> = ({ navigation, csrfToken }) => {
  const [inputValue, setInputValue] = useState<string>(''); // input 값 상태 저장
  

  // CSRF 토큰을 헤더에 포함하여 데이터를 전송하는 함수
  const sendData = async () => {
    try {
      if (!csrfToken) {
        Alert.alert('오류', 'CSRF 토큰을 먼저 가져오세요.');
        return;
      }

      // POST 요청으로 데이터 전송 시 CSRF 토큰을 헤더에 포함
      const res = await api.post('/submit', 
        { data: inputValue }, 
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      );
      Alert.alert('서버 응답', res.data.message);
    } catch (error: unknown) { // unknown 타입으로 error를 정의
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

  return (
    <View>
      <TextInput
        placeholder="값을 입력하세요"
        value={inputValue}
        onChangeText={setInputValue} // input 값 변경 시 상태 업데이트
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }} // 기본 스타일
      />
      <Button
        title="전송"
        onPress={sendData} // 버튼 클릭 시 서버로 데이터 전송
      />

    </View>
  );
};

export default Test;
