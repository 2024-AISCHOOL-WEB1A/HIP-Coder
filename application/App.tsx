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


import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// 각 화면들 import
import Home from './src/screens/Home';
import Join from './src/screens/Join';
import Login from './src/screens/Login';
import MyPage from './src/screens/MyPage';
import QrScan from './src/screens/QrScan';
import UrlCheck from './src/screens/UrlCheck';

const Stack = createStackNavigator();

const App = () => {
  return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Join" component={Join} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="QrScan" component={QrScan} />
        <Stack.Screen name="UrlCheck" component={UrlCheck} />
      </Stack.Navigator>
  );
};

export default App;