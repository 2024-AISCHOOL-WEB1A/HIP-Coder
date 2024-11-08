import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PermissionsAndroid, Alert, BackHandler, Linking } from 'react-native';
import api from './axios';
import { useCsrf } from './context/CsrfContext'; // CsrfProvider는 이미 최상위에서 감스리고 있으니로 useCsrf만 사용

// 각 화면들 import
import Home from './src/screens/Home';
import Join from './src/screens/Join';
import Login from './src/screens/Login';
import MyPage from './src/screens/MyPage';
import QrScan from './src/screens/QrScan';
import UrlCheck from './src/screens/UrlCheck';
import Test from './src/screens/Test';
import FindId from './src/screens/FindId';
import FindPw from './src/screens/FindPw';
import GalleryQrScan from './src/screens/GalleryQrScan';
import History from './src/screens/History'; 
import TermsScreen from './src/screens/TermsScreen';
import Report from './src/screens/Report';

const Stack = createStackNavigator();

const App = () => {
  const { csrfToken, setCsrfToken } = useCsrf();

  const openAppSettings = () => {
    Alert.alert(
      "권한 필요",
      "이 앱은 필수 권한이 거부되었습니다. 앱 설정에서 지정권한을 허용해주세요.",
      [
        { text: "취소", style: "cancel" },
        { text: "설정으로 이동", onPress: () => Linking.openSettings() }
      ]
    );
  };

  const requestStoragePermissions = async () => {
    console.log('권한 요청 시작');

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      if (
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        // 권한이 허용됨
      } else if (
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
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

  const fetchCsrfToken = async () => {
    try {
      const response = await api.get('/config/get-csrf-token', { withCredentials: true });
      console.log('CSRF 토큰 가져오기 성공:', response.data.csrfToken);
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('CSRF 토큰 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    const checkPermissions = async () => {
      await requestStoragePermissions(); // 권한 요청
      fetchCsrfToken(); // CSRF 토큰 가져오기
    };

    checkPermissions();
  }, []);

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Join" component={Join} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MyPage" component={MyPage} />
      <Stack.Screen name="QrScan" component={QrScan} />
      <Stack.Screen name="UrlCheck" component={UrlCheck} />
      <Stack.Screen name="FindId" component={FindId} />
      <Stack.Screen name="FindPw" component={FindPw} />
      <Stack.Screen name="GalleryQrScan" component={GalleryQrScan} />
      <Stack.Screen name="Test" component={Test} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="TermsScreen" component={TermsScreen} />
      <Stack.Screen name="Report" component={Report} />
    </Stack.Navigator>
  );
};

export default App;
