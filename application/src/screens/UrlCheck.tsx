import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import axios from 'axios';
import { FLASK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const UrlCheck: React.FC<Props> = () => {
  const [url, setUrl] = useState('');
  const navigation = useNavigation();

  const checkUrlSafety = async (inputUrl: string) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      const response = await axios.post(`${FLASK_URL}/scan`,{
        url : inputUrl,
        category: 'URL',
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // 서버 응답 확인
      console.log('서버 응답 데이터:', response.data);

      const status = response.data.status;

      if (status === 'good') {
        Alert.alert('안전한 사이트입니다!', '링크로 이동합니다.', [
          { text: 'OK', onPress: () => openUrl(inputUrl) }
        ]);
      } else if (status === 'bad') {
        Alert.alert('주의!', '피싱 사이트일 수 있습니다.');
      } else {
        Alert.alert('오류', '예측 결과를 확인할 수 없습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
      Alert.alert('오류', 'URL 확인 중 오류가 발생했습니다.');
    }
  };

  const openUrl = (inputUrl: string) => {
    // 여기에 URL을 열기 위한 로직 추가 (예: Linking.openURL(inputUrl))
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headerContainer}>
        <Header title="URL 검사" onBackPress={() => navigation.goBack()} />
        {/* <Text style={commonStyles.headerTitle}>URL 검사</Text> */}
      </View>
      <View style={commonStyles.formContainer}>
        <View style={commonStyles.innerContainer}>
          <Text style={commonStyles.textMarginBottom}>검사할 URL을 입력하세요.</Text>

          <TextInput
            style={commonStyles.input}
            placeholder="URL을 입력하세요."
            value={url}
            onChangeText={setUrl}
          />
          <HEButton title="URL 검사" onPress={() => checkUrlSafety(url)} />

          <Text style={commonStyles.text2}>
            {'\n'}{' \n'}{' \n'}{' \n'}{' \n'}{' \n'}{' \n'}{' \n'}{' \n'}{' \n'}
            Thing Q는 URL 링크의 위험도와{'\n'} 정보를 제공합니다.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UrlCheck;
