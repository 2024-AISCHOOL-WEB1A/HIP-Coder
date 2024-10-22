import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import CustomButton from '../components/CustomButton';

interface Props {
  csrfToken: string | null;  // CSRF 토큰을 string 또는 null로 정의
}

const Home: React.FC<Props> = ({ csrfToken }) => {
  const navigation = useNavigation();

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>HIP - GUARD</Text>
      
      <CustomButton title="회원가입" onPress={() => navigation.navigate('Join')} />
      <CustomButton title="로그인" onPress={() => navigation.navigate('Login')} />
      <CustomButton title="내 정보" onPress={() => navigation.navigate('MyPage')} />
      <CustomButton title="QR 스캔" onPress={() => navigation.navigate('QrScan')} />
      <CustomButton title="URL 검사" onPress={() => navigation.navigate('UrlCheck')} />
      <CustomButton title="테스트 지우지마세요!" onPress={() => navigation.navigate('Test')} />
    </View>
  );
};

export default Home;
