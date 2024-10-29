import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/IJButton';
import Header from '../components/Header';

const Login = () => {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log("로그인 정보:", { email, password });
    navigation.navigate('Home');
  };

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <Header onBackPress={() => navigation.goBack()} title="" />
      <View style={styles.innerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>Welcome</Text>
          <Text style={styles.subHeader}>Thing Q</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#838383"
          value={id}
          onChangeText={setId}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          placeholderTextColor="#838383"
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <CustomButton title="로그인" onPress={handleLogin}/>
        </View>
        <View style={styles.linkContainer}>
          <Text style={styles.link} onPress={() => navigation.navigate('Join')}>
            비밀번호를 잊으셨습니까?
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center', 
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100, // Header 높이에 맞춰 여백 조정
    paddingHorizontal: 40, // 양쪽에 40 패딩 추가
    width: '100%', // 전체 너비를 차지하도록 설정
  },
  textContainer: {
    marginTop: 40, // Welcome과 subHeader 사이 간격 추가
    alignItems: 'flex-start',
    width: '100%',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6A1B9A',
    textAlign: 'left',
  },
  subHeader: {
    fontSize: 32,
    color: '#6A1B9A',
    paddingBottom: 40, // subHeader와 아래 요소 간격 추가
    textAlign: 'left',
  },
  input: {
    width: '100%', // input을 전체 너비로 설정
    height: 55,
    borderColor: '#B490CA',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    width: '100%', 
    alignItems: 'center', 
    paddingTop: 20, // 버튼 위쪽 간격 조정
    marginVertical: 10, // 버튼과 링크 사이 간격 추가
  },
  linkContainer: {
    width: '100%', 
    alignItems: 'center', 
  },
  link: {
    color: '#838383',
    textAlign: 'center',
  },
});

export default Login;
