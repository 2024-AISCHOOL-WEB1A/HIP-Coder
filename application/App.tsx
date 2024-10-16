/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import Home from './screens/Home'
import Join from './screens/Join';

const Stack = createNativeStackNavigator();

function App() {
  return (
    // 만약 로딩 페이지가 필요하다면 initialRouteName
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Join' component={Join} />
    </Stack.Navigator>
  )
}

export default App;
