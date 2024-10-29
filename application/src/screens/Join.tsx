import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, ImageBackground, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import CustomButton from '../components/CustomButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import api from '../../axios'
import Header from '../components/Header';
import axios, { AxiosError } from 'axios';



type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;


interface Props {
  navigation: HomeScreenNavigationProp;
  csrfToken: string | null;
}

const Join: React.FC<Props> = ({ csrfToken }) => {

  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birth, setBirth] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [idck, setIdck] = useState<boolean>(false)

  const navigation = useNavigation();

  const handleJoin = async () => {
    if (!csrfToken) {
      Alert.alert('오류', 'CSRF 토큰을 먼저 가져오세요.');
      return;
    }

    try {
      const res = await api.post('/user/handleJoin', {
        id: id,
        password: password,
        passwordCheck: passwordCheck,
        name: name,
        email: email,
        phone: phone
      }, {
        headers: { 'X-CSRF-Token': csrfToken },
        withCredentials: true
      });

      if (res.status === 200) {
        Alert.alert('회원가입 성공', '로그인 페이지로 이동합니다.');
        navigation.navigate('Login');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // AxiosError 타입에 맞게 처리
        if (error.response && error.response.status === 400) {
          Alert.alert('회원가입 실패', error.response.data.error);
        } else {
          Alert.alert('회원가입 실패', '서버에서 알 수 없는 오류가 발생했습니다.');
        }
      } else {
        // Axios 오류가 아닐 때의 처리 (기타 오류)
        console.error('회원가입 중 오류:', error);
        Alert.alert('회원가입 실패', '오류가 발생했습니다.');
      }
    }
  };

  /** 아이디 중복확인 함수 */
  const id_redundancy_check = async () => {

    // 아이디 길이확인
    if (id.length > 4) {
      const res = await api.post(
        '/user/idcheck',
        { idck: id },
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      )

      // console.log('응답', res.data)

      // 아이디 중복여부 체크
      if (res.data.message === '중복') {
        setIdck(false)
        Alert.alert('중복', '이미 사용 중인 아이디입니다.')
      } else if (res.data.message === '가능') {
        setIdck(true)
        Alert.alert('사용 가능한 아이디', '사용 가능한 아이디입니다.')
      }
    } else {
      Alert.alert('경고', '아이디 길이가 짧습니다.')
    }
  }

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={commonStyles.container}
      resizeMode="cover"
    >
      <Header onBackPress={() => navigation.goBack()} />


      <KeyboardAvoidingView
        style={commonStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // iOS와 Android에 맞는 동작 설정
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={commonStyles.container}>
            <View style={commonStyles.view1}>
              <TextInput
                style={commonStyles.input1}
                placeholder="ID를 입력해주세요."
                value={id}
                onChangeText={setId}
                autoCapitalize="none"
              />
              <CustomButton
                title="중복확인"
                onPress={() => id_redundancy_check()}
                style={commonStyles.smallButton} // 스타일 적용
              />

            </View>
            <TextInput
              style={commonStyles.input}
              placeholder="비밀번호를 입력해주세요."
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={commonStyles.input}
              placeholder="비밀번호를 확인해주세요."
              secureTextEntry
              value={passwordCheck}
              onChangeText={setPasswordCheck}
            />
            <View style={commonStyles.view1}>
              <TextInput
                style={commonStyles.input1}
                placeholder="이름을 입력해주세요."
                value={name}
                onChangeText={setName}
              />

            </View>
            <TextInput
              style={commonStyles.input}
              placeholder="Email을 입력해주세요."
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={commonStyles.input}
              placeholder="핸드폰 번호를 입력해주세요."
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />

            <CustomButton style={commonStyles.fullWidthButton} title="회원가입" onPress={handleJoin} />
            <CustomButton style={commonStyles.smallButton} title="로그인" onPress={() => navigation.navigate('Login')} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Join;

