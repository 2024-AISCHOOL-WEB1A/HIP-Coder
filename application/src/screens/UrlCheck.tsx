import React, { useEffect, useState } from 'react';
import { View, TextInput, Alert, Text, Linking, Image, StyleSheet, ActivityIndicator, Modal, Keyboard, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import axios from 'axios';
import { FLASK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const UrlCheck: React.FC<Props> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute();

  // 로그인 상태 확인
  const checkIsLoggedIn = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  };

  const getIconColor = (screen: string) => {
    return route.name === screen ? '#3182f6' : '#9DA3B4';
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('accessToken');
    Alert.alert('알림', '로그아웃 되었습니다.');
    navigation.navigate('Login');
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  const checkUrlSafety = async (inputUrl: string) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');

      let formattedURL = inputUrl.trim().replace(/,/g, '');

      // URL이 http:// 또는 https://로 시작하지 않으면 기본으로 https://www.를 추가
      if (!/^https?:\/\//i.test(formattedURL)) {
        formattedURL = `https://www.${formattedURL}`;
      }

      const response = await axios.post(`${FLASK_URL}/scan`, {
        url: formattedURL,
        category: 'URL',
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const status = response.data.status;

      if (status === 'good') {
        Alert.alert('알림', '안전한 사이트입니다! 링크로 이동합니다.', [
          { text: 'OK', onPress: () => { openURL(formattedURL); navigation.navigate('Home'); } }
        ]);
      } else if (status === 'bad') {
        Alert.alert(
          '경고', '이 URL은 위험할 수 있습니다. 그래도 접속하시겠습니까?',
          [
            { text: 'URL 열기', onPress: () => { openURL(formattedURL); navigation.navigate('Home'); } },
            { text: '취소', style: 'cancel', onPress: () => navigation.navigate('Home') }
          ]
        );
      } else {
        Alert.alert('오류', '예측 결과를 확인할 수 없습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
      Alert.alert('오류', 'URL 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // URL 열기 함수
  const openURL = async (inputUrl: string) => {
    let formattedURL = inputUrl.trim().replace(/,/g, '');

    const isValidURL = (url: string) => {
      const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
      return urlRegex.test(url);
    };

    if (!isValidURL(formattedURL)) {
      Alert.alert('잘못된 URL 형식입니다.');
      return;
    }

    if (!/^https?:\/\//i.test(formattedURL)) {
      formattedURL = `https://www.${formattedURL}`;
    }

    try {
      await Linking.openURL(formattedURL);
    } catch (error) {
      Alert.alert(`URL을 열 수 없습니다: ${formattedURL}`);
      console.error('URL 열기 오류:', error);
    }
  };

  return (
    <View style={commonStyles.container}>
      <Modal
        visible={loading}
        transparent={true}
        animationType="fade"
      >
        <View style={commonStyles.modalBackground}>
          <View style={commonStyles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#3182f6" />
            <Text style={commonStyles.loadingText}>URL을 확인 중입니다.</Text>
          </View>
        </View>

      </Modal>
      <View style={commonStyles.headerContainer}>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} title="URL 검사" onBackPress={() => navigation.navigate('Home')} />
      </View>
      
      <View style={commonStyles.formContainer}>
        <View style={commonStyles.innerContainer}>
          <Image 
            source={require('../assets/images/ThingQFulllogo.png')}
            style={commonStyles.logoImage1}
          />
          <Text style={commonStyles.textMarginBottom}>검사할 URL을 입력하세요.</Text>
          
          <TextInput
            style={commonStyles.input}
            placeholder="URL을 입력하세요."
            value={url}
            onChangeText={setUrl}
            keyboardType="url"
            autoCapitalize="none"
          />

           <HEButton title="URL 검사" onPress={() => checkUrlSafety(url)} />
          <Text style={commonStyles.textBlue}>{'\n'}
            Thing Q는 URL 링크의 위험도를{'\n'} 검사할 수 있습니다.
          </Text>
          
        </View>
      </View>


      <View style={commonStyles.navBar}>
        <TouchableOpacity style={[commonStyles.navButton, commonStyles.touchableAreaHorizontal]} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color={getIconColor('Home')} />
        </TouchableOpacity>
        <TouchableOpacity style={[commonStyles.navButton, commonStyles.touchableAreaHorizontal]} onPress={() => navigation.navigate('History')}>
          <Icon name="time-outline" size={24} color={getIconColor('History')} />
        </TouchableOpacity>
        <TouchableOpacity style={[commonStyles.navButton, commonStyles.touchableAreaHorizontal]} onPress={() => navigation.navigate('MyPage')}>
          <Icon name="person-outline" size={24} color={getIconColor('MyPage')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UrlCheck;
