import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/IJButton';
import Header from '../components/Header';
import api from '../../axios';
import { useCsrf } from '../../context/CsrfContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const Login: React.FC<Props> = () => {
  const [id, setId] = useState<string>(''); // email을 id로 변경
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigation = useNavigation();
  const { csrfToken } = useCsrf();

  const handleLogin = async () => {
    console.log("로그인 정보:", { id, password }); // email을 id로 변경
    try {
      const res = await api.post('/user/handleLogin', {
        id: id,
        password: password
      }, {
        headers: { 'X-CSRF-Token': csrfToken }
      });
      
      if (res.status === 200) {
        const { token, temporaryPassword } = res.data;
        await AsyncStorage.setItem('token', token);
        console.log('AsyncStorage에 저장된 token', await AsyncStorage.getItem('token'));

        // Alert.alert('알림' ,'환영합니다');
        setIsLoggedIn(true);

        if (temporaryPassword) {
          // 임시 비밀번호로 로그인한 경우 비밀번호 변경을 유도하는 화면으로 이동
          Alert.alert('알림', '임시 비밀번호로 로그인되었습니다. 비밀번호를 변경해 주세요.');
          navigation.navigate('ChangePassword');
        } else {
          navigation.navigate('Home');
        }
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
    <LinearGradient
      colors={['#FFFFFF', '#F3E5F5', '#E1BEE7']}  
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
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
    </LinearGradient>
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
    paddingTop: 120, 
    paddingHorizontal: 40,
    width: '100%',
  },
  textContainer: {
    marginTop: 40,
    alignItems: 'flex-start',
    width: '100%',
  },
  header: {
    fontSize: 28,
    color: '#6A1B9A', 
    textAlign: 'left',
    fontFamily: 'Pretendard-Regular', 
  },
  subHeader: {
    fontSize: 32,
    color: '#6A1B9A',  
    paddingBottom: 40,
    textAlign: 'left',
    fontFamily: 'Pretendard-Bold', 
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
    fontFamily: 'Pretendard-Regular',
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
    fontFamily: 'Pretendard-Regular', 
  },
});

export default Login;
