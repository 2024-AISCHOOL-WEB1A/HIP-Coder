import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PermissionsAndroid, Alert, BackHandler, Linking } from 'react-native';
import api from './axios';

// 각 화면들 import
import Home from './src/screens/Home';
import Join from './src/screens/Join';
import Login from './src/screens/Login';
import MyPage from './src/screens/MyPage';
import QrScan from './src/screens/QrScan';
import UrlCheck from './src/screens/UrlCheck';
import Test from './src/screens/Test';

const Stack = createStackNavigator();

const App = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const openAppSettings = () => {
    Alert.alert(
      "권한 필요",
      "이 앱은 필요한 권한이 거부되었습니다. 앱 설정에서 직접 권한을 허용해주세요.",
      [
        { text: "취소", style: "cancel" },
        { text: "설정으로 이동", onPress: () => Linking.openSettings() }
      ]
    );
  };

  // 권한 요청 함수
  const requestStoragePermission = async () => {
    console.log('권한 요청 시작');

    try {
      const grantedWrite = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '저장소 접근 권한',
          message: '이 앱은 파일을 저장하고 읽기 위해 저장소 접근 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '거부',
          buttonPositive: '허용',
        },
      );
  
      const grantedRead = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: '저장소 접근 권한',
          message: '이 앱은 파일을 저장하고 읽기 위해 저장소 접근 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '거부',
          buttonPositive: '허용',
        },
      );
  
      if (grantedWrite === PermissionsAndroid.RESULTS.GRANTED && grantedRead === PermissionsAndroid.RESULTS.GRANTED) {
        
      } else if (grantedWrite === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || grantedRead === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // "다시 묻지 않음" 상태일 경우 설정으로 안내
        openAppSettings();
      } else {
        Alert.alert(
          '권한 거부',
          '저장소 접근 권한이 거부되었습니다. 이 앱은 권한이 없으면 실행할 수 없습니다.',
          [{ text: '확인', onPress: () => BackHandler.exitApp() }]
        );
      }
    } catch (err) {
      console.warn('권한 요청 실패:', err);
    }
  };

  // CSRF 토큰 가져오는 함수
  const fetchCsrfToken = async () => {
    try {
      const response = await api.get('/config/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('CSRF 토큰 가져오기 실패:', error);
    }
  };

  // useEffect로 권한 요청 및 CSRF 토큰 가져오기 처리
  useEffect(() => {
    const checkPermissions = async () => {
      await requestStoragePermission(); // 권한 요청
      fetchCsrfToken(); // CSRF 토큰 가져오기
    };
    
    checkPermissions();
  }, []);

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home">
        {props => <Home {...props} csrfToken={csrfToken} />}
      </Stack.Screen>
      <Stack.Screen name="Join">
        {props => <Join {...props} csrfToken={csrfToken} />}
      </Stack.Screen>
      <Stack.Screen name="Login">
        {props => <Login {...props} csrfToken={csrfToken} />}
      </Stack.Screen>
      <Stack.Screen name="MyPage">
        {props => <MyPage {...props} csrfToken={csrfToken} />}
      </Stack.Screen>
      <Stack.Screen name="QrScan">
        {props => <QrScan {...props} csrfToken={csrfToken} />}
      </Stack.Screen>
      <Stack.Screen name="UrlCheck">
        {props => <UrlCheck {...props} csrfToken={csrfToken} />}
      </Stack.Screen>
      <Stack.Screen name="Test">
        {props => <Test {...props} csrfToken={csrfToken} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default App;
