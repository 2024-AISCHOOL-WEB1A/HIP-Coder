import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';

interface Props {
  csrfToken: string | null;  // CSRF 토큰을 string 또는 null로 정의
}

const Home: React.FC<Props> = ({ csrfToken }) => {
  const navigation = useNavigation();

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>HIP - GUARD</Text>
      
      <HEButton title="회원가입" onPress={() => navigation.navigate('Join')} />
      <HEButton title="로그인" onPress={() => navigation.navigate('Login')} />
      <HEButton title="내 정보" onPress={() => navigation.navigate('MyPage')} />
      <HEButton title="QR 스캔" onPress={() => navigation.navigate('QrScan')} />
      <HEButton title="URL 검사" onPress={() => navigation.navigate('UrlCheck')} />
      <HEButton title="테스트 지우지마세요!" onPress={() => navigation.navigate('Test')} />
    </View>
  );
};

export default Home;
