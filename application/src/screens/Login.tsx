import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import CustomButton from '../components/IJButton';
import Header from '../components/Header';
import api from '../../axios';
import { useCsrf } from '../../context/CsrfContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login: React.FC<Props> = () => {
  const [id, setId] = useState<string>(''); // email을 id로 변경
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigation = useNavigation();
  const { csrfToken } = useCsrf();

  const handleLogin = async () => {
    console.log("로그인 정보:", { id, password });
    try {
      const res = await api.post('/user/handleLogin', {
        id: id,
        password: password
      }, {
        headers: { 'X-CSRF-Token': csrfToken }
      });
      
      if (res.status === 200) {
        const { token, temporaryPassword, userName } = res.data;
        await AsyncStorage.setItem('accessToken', token);
        await AsyncStorage.setItem('username', userName); // 사용자 이름을 AsyncStorage에 저장
        console.log('AsyncStorage에 저장된 token', await AsyncStorage.getItem('accessToken'));
  
        setIsLoggedIn(true);
  
        if (temporaryPassword) {
          Alert.alert('알림', '임시 비밀번호로 로그인되었습니다. 비밀번호를 변경해 주세요.');
        }
        
        // 로그인 후 네비게이션 스택을 초기화하여 홈 화면으로 이동
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }], // 홈 화면으로 이동
          })
        );
  
      } else if (res.status === 400) {
        Alert.alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          Alert.alert('오류', error.response.data.error || '아이디 또는 비밀번호가 일치하지 않습니다.');
        } else if (error.response.status === 500) {
          Alert.alert('서버 오류', '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          Alert.alert('오류', error.response.data.error || '로그인 중 오류가 발생했습니다.');
        }
      } else {
        Alert.alert('네트워크 오류', '네트워크 연결을 확인하고 다시 시도해주세요.');
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} title="" />
      <View style={styles.innerContainer}>
        <View style={styles.textContainer}>
          <Image
            source={require('../assets/images/ThingQFulllogo.png')} 
            style={styles.logo}
          />
          <View style={styles.spacer} />
          <Text style={styles.loginText}></Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#616161"
          value={id} 
          onChangeText={setId} 
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          placeholderTextColor="#616161"
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <CustomButton title="로그인" onPress={handleLogin} />
        </View>
        <View style={styles.linkContainer}>
          <Text style={styles.link} onPress={() => navigation.navigate('FindId')}>
            ID를 잊으셨습니까?
          </Text>
          <Text style={styles.link} onPress={() => navigation.navigate('FindPw')}>
            비밀번호를 잊으셨습니까?
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60, 
    paddingHorizontal: 40,
    width: '100%',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 45, 
    resizeMode: 'contain', 
  },
  spacer: {
    height: 60,
  },
  loginText: {
    fontSize: 24,
    color: '#3182f6', 
    fontFamily: 'Pretendard-Bold',
    paddingBottom: 10, 
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#B0BEC5',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: '#000000',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
  },
  linkContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  link: {
    color: '#1E88E5',
    textAlign: 'center',
    fontFamily: 'Pretendard-Regular', 
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Login;
