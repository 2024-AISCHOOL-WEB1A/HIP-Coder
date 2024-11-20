import React, { useEffect, useRef, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert, BackHandler, ToastAndroid, NativeModules, Linking, View, StatusBar } from 'react-native'; // View, StatusBar 추가
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import api from './axios';
import { useCsrf } from './context/CsrfContext';
import { LogBox } from 'react-native';

import IntroScreen from './src/screens/IntroScreen';
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
import ReportImage from './src/screens/ReportImage';

const Stack = createStackNavigator();
const { ExitAppModule } = NativeModules; // 네이티브 모듈 가져오기
LogBox.ignoreAllLogs(true);

const App: React.FC = () => {
  const { csrfToken, setCsrfToken } = useCsrf();
  const backPressCount = useRef(0);
  const [isAlertVisible, setIsAlertVisible] = useState(false); // 경고창 플래그
  const [hasRequestedPermissionBefore, setHasRequestedPermissionBefore] = useState(false); // 최초 권한 요청 여부 추적

  // 카메라 권한 요청 함수
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const result = await check(PERMISSIONS.ANDROID.CAMERA);
      if (result === RESULTS.GRANTED) {
        console.log('카메라 권한이 이미 허용됨.');
        return true;
      } else if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
        if (hasRequestedPermissionBefore) {
          // 이미 권한을 거부한 상태라면 설정 이동 또는 종료 옵션 제공
          if (!isAlertVisible) {
            setIsAlertVisible(true);
            Alert.alert(
              '권한 필요',
              '카메라 권한이 필요합니다. 권한을 허용하려면 설정으로 이동해 주세요.',
              [
                {
                  text: '종료',
                  onPress: () => {
                    console.log('사용자가 종료를 선택했습니다.');
                    setIsAlertVisible(false);
                    ExitAppModule.exitApp(); // 앱 종료
                  },
                },
                {
                  text: '설정으로 이동',
                  onPress: () => {
                    setIsAlertVisible(false);
                    Linking.openSettings(); // 설정 페이지로 이동
                    ExitAppModule.exitApp(); // 설정 페이지로 이동 후 앱 종료
                  },
                },
              ],
              { cancelable: false }
            );
          }
          return false;
        } else {
          // 최초 권한 요청 시
          const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
          console.log('카메라 권한 요청 결과:', requestResult);
          if (requestResult !== RESULTS.GRANTED) {
            // 사용자가 권한 거부한 경우 이후 실행부터는 설정 및 종료 옵션만 제공
            setHasRequestedPermissionBefore(true);
            setIsAlertVisible(true);
            Alert.alert(
              '권한 거부됨',
              '카메라 권한을 거부하셨습니다. 카메라 권한이 없으면 앱을 사용할 수 없습니다.',
              [
                {
                  text: '종료',
                  onPress: () => {
                    console.log('사용자가 종료를 선택했습니다.');
                    setIsAlertVisible(false);
                    ExitAppModule.exitApp(); // 앱 종료
                  },
                },
                {
                  text: '설정으로 이동',
                  onPress: () => {
                    setIsAlertVisible(false);
                    Linking.openSettings(); // 설정 페이지로 이동
                    ExitAppModule.exitApp(); // 설정 페이지로 이동 후 앱 종료
                  },
                },
              ],
              { cancelable: false }
            );
            return false;
          }
          setHasRequestedPermissionBefore(true); // 권한 요청을 시도했음을 기록
          return requestResult === RESULTS.GRANTED;
        }
      }
    } catch (err) {
      console.warn('카메라 권한 요청 실패:', err);
      // 오류 발생 시 안내 메시지 추가
      if (!isAlertVisible) {
        setIsAlertVisible(true);
        Alert.alert(
          '오류 발생',
          '권한 요청 중 문제가 발생했습니다. 다시 시도해 주세요.',
          [
            {
              text: '확인',
              onPress: () => {
                console.log('오류 확인');
                setIsAlertVisible(false);
              },
            },
          ]
        );
      }
      return false;
    }
  };

  // CSRF 토큰 가져오는 함수
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
      // 카메라 권한 요청
      const cameraPermissionGranted = await requestCameraPermission();
      if (cameraPermissionGranted) {
        fetchCsrfToken(); // 권한이 허용된 경우 CSRF 토큰 가져오기
      }
    };

    checkPermissions();

    // 뒤로가기 버튼 이벤트 설정
    const backAction = () => {
      if (backPressCount.current === 0) {
        ToastAndroid.show('한 번 더 누르면 종료됩니다.', ToastAndroid.SHORT);
        backPressCount.current += 1;

        // 2초 내에 두 번째로 뒤로가기를 누르지 않으면 카운터 초기화
        setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);

        return true; // 기본 뒤로가기 동작을 막음
      } else if (backPressCount.current === 1) {
        ExitAppModule.exitApp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"  // 상태바의 아이콘 및 텍스트 색상 설정
        backgroundColor="transparent"  // 상태바 배경색을 투명하게 설정
        translucent={true}  // 상태바를 투명하게 만들어서 컨텐츠 위로 오도록 설정
      />
      <Stack.Navigator initialRouteName="Intro" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={IntroScreen} />
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
        <Stack.Screen name="ReportImage" component={ReportImage} />
      </Stack.Navigator>
    </View>
  );
};

export default App;
