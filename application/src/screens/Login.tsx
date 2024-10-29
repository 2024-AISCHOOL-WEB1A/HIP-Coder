import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/IJButton';
import Header from '../components/Header';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log("로그인 정보:", { email, password });
    setIsLoggedIn(true); 
    navigation.navigate('Home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false); 
    setEmail(''); 
    setPassword(''); 
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
        {!isLoggedIn ? ( // 로그인 여부에 따라 다른 UI 표시
          <>
            <TextInput
              style={styles.input}
              placeholder="아이디"
              placeholderTextColor="#838383"
              value={email}
              onChangeText={setEmail}
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
          </>
        ) : (
          <View style={styles.buttonContainer}>
            <CustomButton title="로그아웃" onPress={handleLogout} />
          </View>
        )}
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
    paddingTop: 100,
    paddingHorizontal: 40,
    width: '100%',
  },
  textContainer: {
    marginTop: 40,
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
    paddingBottom: 40,
    textAlign: 'left',
  },
  input: {
    width: '100%',
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
    paddingTop: 20,
    marginVertical: 10,
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
