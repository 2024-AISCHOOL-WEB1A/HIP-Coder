/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// import React from 'react';
// import {createNativeStackNavigator} from '@react-navigation/native-stack'

// import Home from './src/screens/Home'
// import Join from './src/screens/Join';
// import Test from './src/screens/Test';

// const Stack = createNativeStackNavigator();

// function App() {
//   return (
//     // 만약 로딩 페이지가 필요하다면 initialRouteName
//     <Stack.Navigator initialRouteName="Home">
//       <Stack.Screen name='Home' component={Home} />
//       <Stack.Screen name='Join' component={Join} />
//       <Stack.Screen name='Test' component={Test} />
//     </Stack.Navigator>
//   )
// }

// export default App


import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Cookies from '@react-native-cookies/cookies';
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

  // CSRF 토큰을 서버에서 가져오는 useEffect
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await api.get('/config/get-csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);  // CSRF 토큰을 상태에 저장
      } catch (error) {
        console.error('CSRF 토큰 가져오기 실패:', error);
      }
    };

    fetchCsrfToken();
  }, []); // 컴포넌트가 처음 렌더링될 때 CSRF 토큰 발급

  return (
    <Stack.Navigator initialRouteName="Home">
      {/* 각 화면에 CSRF 토큰을 props로 전달 */}
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
