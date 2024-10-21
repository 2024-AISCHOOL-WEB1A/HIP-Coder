import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log("로그인 정보:", { email, password });
    navigation.navigate('Home');
  };

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} // 올바른 상대 경로
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.textContainer}>
        <Text style={styles.header}>Welcome</Text>
        <Text style={styles.subHeader}>Thing Q</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="아이디"
        placeholderTextColor="#AFAFAF"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        placeholderTextColor="#AFAFAF"
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <CustomButton title="로그인" onPress={handleLogin} />
      </View>
      <Text style={styles.link} onPress={() => navigation.navigate('Join')}>
        비밀번호를 잊으셨습니까?
      </Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // 왼쪽 정렬
    padding: 20,
  },
  textContainer: {
    marginBottom: 20,
    alignItems: 'flex-start', // 왼쪽 정렬
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6A1B9A', // 텍스트 색상
  },
  subHeader: {
    fontSize: 32,
    color: '#6A1B9A', // 서브 텍스트 색상
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#6A1B9A',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#FFFFFF', // 입력 필드 배경 색상
  },
  buttonContainer: {
    width: '100%', // 버튼을 전체 너비로 설정
    alignItems: 'center', // 버튼을 중앙에 정렬
    marginVertical: 20,
  },
  link: {
    marginTop: 20,
    color: '#6A1B9A',
    textDecorationLine: 'underline',
  },
});

export default Login;
