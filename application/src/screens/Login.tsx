import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/IJButton';
import Header from '../components/Header';
import api from '../../axios';

interface Props {
  csrfToken: string | null;
}

const Login: React.FC<Props> = ({ csrfToken }) => {
  const [id, setId] = useState<string>(''); // email을 id로 변경
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    console.log("로그인 정보:", { id, password }); // email을 id로 변경
    navigation.navigate('Home');
    try {
      const res = await api.post('/user/handleLogin', {
        id: id,
        password: password
      }, {
        headers: { 'X-CSRF-Token': csrfToken }
      })
      if (res.status === 200) {
        Alert.alert('환영합니다')
        setIsLoggedIn(true);
      } else if(res.status === 400) {
        Alert.alert('비밀번호가 일치하지 않습니다.')
      };
    }
    catch (error) {
      Alert.alert('예상치 못한 오류가 발생하였습니다.')
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setId(''); // email을 id로 변경
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
        <TextInput
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#838383"
          value={id} // email을 id로 변경
          onChangeText={setId} // email을 setId로 변경
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
