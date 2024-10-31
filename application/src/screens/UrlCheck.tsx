import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import axios from 'axios';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  // csrfToken: string | null;
}

const UrlCheck: React.FC<Props> = () => {

  const [url, setUrl] = useState('');

  const navigation = useNavigation();

  const checkUrlSafety = async (inputUrl: string) => {
    try {
      const response = await axios.post('YOUR_API_ENDPOINT', { url: inputUrl });
      const isSafe = response.data.isSafe; // Assuming your API returns this field

      if (isSafe) {
        Alert.alert('안전한 사이트입니다!', '링크로 이동합니다.', [
          { text: 'OK', onPress: () => openUrl(inputUrl) }
        ]);
      } else {
        Alert.alert('주의!', '피싱 사이트일 수 있습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', 'URL 확인 중 오류가 발생했습니다.');
    }
  };

  const openUrl = (inputUrl: string) => {
    // 여기에 URL을 열기 위한 로직 추가 (예: Linking.openURL(inputUrl))
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headerContainer}>
        <Header onBackPress={() => navigation.goBack()} />
          <Text style={commonStyles.headerTitle}>URL 검사</Text>
      </View>
        <View style={commonStyles.formContainer}>
          <View style={commonStyles.innerContainer}>
        <Text style={commonStyles.text1}>검사할 URL을 입력하세요.</Text>

          <TextInput style={commonStyles.input}
            placeholder="URL을 입력하세요."
            value={url}
            onChangeText={setUrl}
          />
          <HEButton title="URL 검사" onPress={() => checkUrlSafety(url)} />

          <Text style={commonStyles.text2}>
            {'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}
            Thing Q는 URL 링크의 위험도와{'\n'} 정보를 제공합니다.</Text>
            </View>
      </View>
    </View>
  );
};

export default UrlCheck;

