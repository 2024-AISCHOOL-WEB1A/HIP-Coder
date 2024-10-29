import React, { useState } from 'react';
import { View, Button, Alert, TextInput, Linking, FlatList, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../axios';
import { AxiosError } from 'axios';
import { RootStackParamList } from '../../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  csrfToken: string | null; // CSRF 토큰을 props로 받음
}

interface UserData {
  USER_NAME: string;
  PHONE: string;
  EMAIL: string;
  CONTACT_INFO: string[];
}

const Test: React.FC<Props> = ({ navigation, csrfToken }) => {
  const [inputValue, setInputValue] = useState<string>('');  // 일반 데이터 상태
  const [urlValue, setUrlValue] = useState<string>('');  // URL 데이터 상태
  const [userData, setUserData] = useState<UserData[]>([]);  // 사용자 데이터 상태

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
      handleApiError(error);
    }
  };

  // URL 검사 및 처리 함수
  const urlData = async () => {
    console.log("입력된 URL:", urlValue);
    try {
      const res = await api.post(
        '/scan/urltest', 
        { url: urlValue },
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      );

      switch (res.data.status) {
        case 'safe':
          openURL(urlValue);
          break;
        case 'danger':
          Alert.alert(
            '경고', '이 URL은 위험할 수 있습니다. 그래도 접속하시겠습니까?',
            [
              { text: '취소', style: 'cancel' },
              { text: '접속', onPress: () => openURL(urlValue) }
            ]
          );
          break;
        case 'invalid':
          Alert.alert('서버 응답', 'URL을 확인 해주세요.');
          break;
        case 'error':
          Alert.alert('서버 응답', '잘못된 URL입니다.');
          break;
        default:
          Alert.alert('서버 응답', '알 수 없는 응답입니다.');
      }
    } catch (error) {
      console.error('URL 검사 오류:', error);
      Alert.alert('오류', 'URL 검사에 실패했습니다.');
    }
  };

  // URL 열기 함수
  const openURL = async (url: string) => {
    let formattedURL = url.trim().replace(/,/g, '');

    const isValidURL = (url: string) => {
      const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
      return urlRegex.test(url);
    };

    if (!isValidURL(formattedURL)) {
      Alert.alert('잘못된 URL 형식입니다.');
      return;
    }

    if (!/^https?:\/\//i.test(formattedURL)) {
      formattedURL = `http://${formattedURL}`;
    }

    try {
      await Linking.openURL(formattedURL);
    } catch (error) {
      Alert.alert(`URL을 열 수 없습니다: ${formattedURL}`);
      console.error('URL 열기 오류:', error);
    }
  };

  // 사용자 데이터를 가져오는 함수
  const mypagelist = async () => {
    try {
      if (!csrfToken) {
        Alert.alert('오류', 'CSRF 토큰을 먼저 가져오세요.');
        return;
      }

      const res = await api.post(
        '/user/mypage', 
        { idx: '1' },
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      );

      // 서버에서 받은 데이터를 'message' 키를 통해 접근 및 가공
      if (res.data && Array.isArray(res.data.message)) {
        const processedData: UserData[] = res.data.message.map((item: any) => ({
          USER_NAME: item.USER_NAME,
          PHONE: item.PHONE,
          EMAIL: item.EMAIL,
          CONTACT_INFO: [item.CONTACT_INFO1, item.CONTACT_INFO2].filter(Boolean),
        }));

        setUserData(processedData);
        Alert.alert('서버 응답', '사용자 데이터를 불러왔습니다.');
      } else {
        console.error('잘못된 데이터 형식:', res.data);
        Alert.alert('오류', '서버로부터 잘못된 형식의 데이터가 반환되었습니다.');
      }
    } catch (error: unknown) {
      handleApiError(error);
    }
  };

  // API 오류 핸들링 함수
  const handleApiError = (error: unknown) => {
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
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
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
      <Button
        title="마이페이지 불러오기"
        onPress={mypagelist}
      />

      {/* 사용자 데이터를 표시하는 부분 */}
      {userData.length > 0 ? (
        <FlatList
          data={userData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
              <Text>이름: {item.USER_NAME}</Text>
              <Text>전화번호: {item.PHONE}</Text>
              <Text>이메일: {item.EMAIL}</Text>
              <Text>연락처:</Text>
              {item.CONTACT_INFO.map((contact, idx) => (
                <Text key={idx} style={{ marginLeft: 10 }}>
                  - {contact}
                </Text>
              ))}
            </View>
          )}
        />
      ) : (
        <Text>사용자 데이터가 없습니다.</Text>
      )}
    </View>
  );
};

export default Test