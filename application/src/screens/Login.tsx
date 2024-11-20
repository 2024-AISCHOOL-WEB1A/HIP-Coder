import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
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
    console.log('로그인 정보:', { id, password });
    try {
      const res = await api.post(
        '/user/handleLogin',
        {
          id: id,
          password: password,
        },
        {
          headers: { 'X-CSRF-Token': csrfToken },
        }
      );

      if (res.status === 200) {
        const { token, temporaryPassword, userName } = res.data;
        await AsyncStorage.setItem('accessToken', token);
        await AsyncStorage.setItem('username', userName); // 사용자 이름을 AsyncStorage에 저장
        console.log(
          'AsyncStorage에 저장된 token',
          await AsyncStorage.getItem('accessToken')
        );

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
          Alert.alert(
            '오류',
            error.response.data.error || '아이디 또는 비밀번호가 일치하지 않습니다.'
          );
        } else if (error.response.status === 500) {
          Alert.alert(
            '서버 오류',
            '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
          );
        } else {
          Alert.alert(
            '오류',
            error.response.data.error || '로그인 중 오류가 발생했습니다.'
          );
        }
      } else {
        Alert.alert(
          '네트워크 오류',
          '네트워크 연결을 확인하고 다시 시도해주세요.'
        );
      }
    }
  };

  const handleBackPress = () => {
    // 뒤로가기 버튼 누르면 홈 화면으로 이동하도록 스택 초기화
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      {/* Header는 최상단에 고정 */}
      <Header onBackPress={handleBackPress} title="" />
      
      {/* ScrollView로 스크롤 가능 영역 정의 */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
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
            keyboardType="ascii-capable"
            textContentType="username"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            secureTextEntry
            placeholderTextColor="#616161"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.buttonContainer}>
            <CustomButton title="로그인" onPress={handleLogin} />
          </View>
          <View style={styles.linkContainer}>
            <Text
              style={[styles.link, styles.linkRight]}
              onPress={() => navigation.navigate('FindId')}
            >
              아이디 찾기 |
            </Text>
            <Text
              style={[styles.link, styles.linkRight]}
              onPress={() => navigation.navigate('FindPw')}
            >
              비밀번호 찾기
            </Text>
          </View>

          <View style={styles.linkContainer}>
            <Text style={styles.normalText}>
              아직 회원이 아니신가요?{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('Join')}
              >
                회원가입
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 60,
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: 40,
    paddingTop: 20,
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
    height: 40,
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
    fontSize: 14,
    color: '#000000',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#1E88E5',
    textAlign: 'center',
    fontSize: 16,
  },
  linkRight: {
    marginHorizontal: 5,
  },
  normalText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default Login;
