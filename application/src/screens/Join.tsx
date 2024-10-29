import React, { useState } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import api from '../../axios';
import axios from 'axios';
import Header from '../components/BGHeader';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  csrfToken: string | null;
}

const Join: React.FC<Props> = ({ csrfToken }) => {
  const [step, setStep] = useState(1);
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [idck, setIdck] = useState<boolean>(false);

  const navigation = useNavigation();

  const handleJoin = async () => {
    if (!csrfToken) {
      Alert.alert('오류', 'CSRF 토큰을 먼저 가져오세요.');
      return;
    }

    try {
      const res = await api.post('/user/handleJoin', {
        id,
        password,
        passwordCheck,
        name,
        email,
        phone
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
        if (error.response && error.response.status === 400) {
          Alert.alert('회원가입 실패', error.response.data.error);
        } else {
          Alert.alert('회원가입 실패', '서버에서 알 수 없는 오류가 발생했습니다.');
        }
      } else {
        console.error('회원가입 중 오류:', error);
        Alert.alert('회원가입 실패', '오류가 발생했습니다.');
      }
    }
  };

  const id_redundancy_check = async () => {
    if (id.length > 4) {
      try {
        const res = await api.post('/user/idcheck', { idck: id }, {
          headers: { 'X-CSRF-Token': csrfToken },
          withCredentials: true
        });

        if (res.data.message === '중복') {
          setIdck(false);
          Alert.alert('중복', '이미 사용 중인 아이디입니다.');
        } else if (res.data.message === '가능') {
          setIdck(true);
          Alert.alert('사용 가능한 아이디', '사용 가능한 아이디입니다.');
        }
      } catch (error) {
        console.error('아이디 중복 확인 중 오류:', error);
        Alert.alert('오류', '아이디 중복 확인 중 오류가 발생했습니다.');
      }
    } else {
      Alert.alert('경고', '아이디 길이가 짧습니다.');
    }
  };

  const nextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      handleJoin();
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headerContainer}>
        <Header onBackPress={() => navigation.goBack()} />
        <Text style={commonStyles.headerTitle}>Let's{'\n'}Start!</Text>
      </View>
      <View style={commonStyles.formContainer}>
        <View style={commonStyles.innerContainer}>
          {step === 1 && (
            <>
              <Text style={commonStyles.termsText}>이용약관에 동의하시겠습니까?{'\n'}</Text>
            </>
          )}
          {step === 2 && (
            <>
              <View style={commonStyles.view1}>
                <TextInput
                  style={commonStyles.input1}
                  placeholder="ID를 입력해주세요."
                  value={id}
                  onChangeText={setId}
                  autoCapitalize="none"
                />
                <HEButton
                  title="중복확인"
                  onPress={id_redundancy_check}
                  style={commonStyles.smallButton}
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
              <TextInput
                style={commonStyles.input}
                placeholder="이름을 입력해주세요."
                value={name}
                onChangeText={setName}
              />
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
            </>
          )}
          {step === 3 && (
            <>
              <TextInput
                style={commonStyles.input}
                placeholder="비상연락망을 입력해주세요."
                value={emergencyContact}
                onChangeText={setEmergencyContact}
              />
            </>
          )}
          <HEButton style={commonStyles.fullWidthButton} title="다음" onPress={nextStep} />
          <View style={commonStyles.linkContainer}>
            <Text style={commonStyles.link} onPress={() => navigation.navigate('Login')}>
              이미 ID가 존재합니다. 로그인하시겠습니까?
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Join;
