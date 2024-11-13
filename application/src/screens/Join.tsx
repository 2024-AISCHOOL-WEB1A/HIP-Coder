import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import api from '../../axios';
import axios from 'axios';
import Header from '../components/BGHeader';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useCsrf } from '../../context/CsrfContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
interface Props {
  navigation: HomeScreenNavigationProp;
}

const Join: React.FC<Props> = () => {
  const [step, setStep] = useState(1);
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [emergencyContact1, setEmergencyContact1] = useState<string>('');
  const [emergencyContact2, setEmergencyContact2] = useState<string>('');
  const [idck, setIdck] = useState<boolean>(false);
  const [terms1Accepted, setTerms1Accepted] = useState<boolean>(false);
  const [terms2Accepted, setTerms2Accepted] = useState<boolean>(false);
  const [allTermsAccepted, setAllTermsAccepted] = useState<boolean>(false);
  const { csrfToken } = useCsrf();

  const navigation = useNavigation();

  const handleBackPress = () => {
    if (step > 1) {
      setStep(step - 1); // 이전 단계로 이동
    } else {
      navigation.goBack(); // 첫 번째 단계에서 뒤로 가기
    }
  };

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
        phone,
        emergencyContact1,
        emergencyContact2
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

  /**
   * 
   * 
   * 
   * 회원가입 프론트 수정중에 값 입력하는거 걸리적거리면 여기부터 여기까지 라고 써진부분 주석처리 하시면 됩니다.
   * 총 2군데 있습니다.
   * 
   * 
   */

  const nextStep = () => {
    if (step === 1) {
      if (!allTermsAccepted) { // 모두 동의 체크 여부
        Alert.alert('경고', '모든 이용약관에 동의하셔야 다음으로 넘어갈 수 있습니다.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!idck) { // 여기부터 <==============================
        Alert.alert('경고', '아이디 중복 확인을 해주세요.');
        return;
      } if (!id) {
        Alert.alert('경고', '아이디를 입력해주세요.');
        return;
      } if (!password) {
        Alert.alert('경고', '비밀번호를 입력해주세요.');
        return;
      } if (password !== passwordCheck) {
        Alert.alert('경고', '비밀번호가 일치하지 않습니다.');
        return;
      } if (!name) {
        Alert.alert('경고', '이름을 입력해주세요.')
      }
      const nameRegex = /^[^0-9]*$/;
      if (!nameRegex.test(name)) {
        Alert.alert('경고', '이름에 숫자가 포함될 수 없습니다.');
        return;
      }
      if (!email) {
        Alert.alert('경고', '이메일을 입력해주세요.');
        return;
      }
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(email) || /@[\w-]*\d/.test(email)) {
        Alert.alert('경고', '유효한 이메일 주소를 입력해주세요.');
        return;
      } if (!phone) {
        Alert.alert('경고', '핸드폰 번호를 입력해주세요.');
        return;
      } if (phone.length !== 11) {
        Alert.alert('경고', '유효한 핸드폰 번호를 입력해주세요.')
        return;
      } // 여기까지 <===========================
      setStep(3);
    } else if (step === 3) {
      if (!emergencyContact1) { // 여기부터 <==========================
        Alert.alert('경고', '비상연락망1을 입력해주세요.')
        return;
      } if (!emergencyContact2) {
        Alert.alert('경고', '비상연락망2을 입력해주세요.')
        return;
      } // 여기까지 <====================================
      handleJoin();
    }
  };

  // 체크박스 상태 업데이트 함수
  const updateTerms = () => {
    const allAccepted = terms1Accepted && terms2Accepted;
    setAllTermsAccepted(allAccepted);
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headerContainer}>
      <Header title="회원가입" onBackPress={handleBackPress} />
        {/* <Text style={commonStyles.headerTitle}>회원가입</Text> */}
      </View>
      <View style={commonStyles.formContainer}>
        <View style={commonStyles.innerContainer}>
          {step === 1 && (
            <> 
              <Text style={commonStyles.textGraySmall}>이용약관에 동의하시겠습니까?{'\n'}</Text>
              <View style={commonStyles.view3}>
              <BouncyCheckbox
                isChecked={allTermsAccepted}
                onPress={() => {
                  const newValue = !allTermsAccepted;
                  setAllTermsAccepted(newValue);
                  setTerms1Accepted(newValue);
                  setTerms2Accepted(newValue);
                }}
              />
              <Text style={commonStyles.text1}>모두 동의</Text>
              </View>
              <View style={commonStyles.view2}>
              <View style={commonStyles.view3}>
              <BouncyCheckbox
                isChecked={terms1Accepted}
                onPress={() => {
                  const newValue = !terms1Accepted;
                  setTerms1Accepted(newValue);
                  setAllTermsAccepted(newValue && terms2Accepted);
                }}
              />
                <Text onPress={() => navigation.navigate('TermsScreen', { termType: 'personalInfo' })} style={commonStyles.textGrayMedium}>
                (필수) 개인정보 수집·이용 약관
                </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('TermsScreen', { termType: 'ageRestriction' })}>
                  <Text> > </Text>
                </TouchableOpacity>
              </View>

              <View style={commonStyles.view2}>
              <View style={commonStyles.view3}>
              <BouncyCheckbox
                isChecked={terms2Accepted}
                onPress={() => {
                  const newValue = !terms2Accepted;
                  setTerms2Accepted(newValue);
                  setAllTermsAccepted(newValue && terms1Accepted);
                }}
              />
               <Text onPress={() => navigation.navigate('TermsScreen', { termType: 'ageRestriction' })}>
                (필수) 만 14세 이상 약관
                </Text>
               </View>
              <Text> > </Text>
              </View>
              
              
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
                placeholder="비상연락망1 을 입력해주세요."
                value={emergencyContact1}
                onChangeText={setEmergencyContact1}
                autoCapitalize="none"
              />
              <TextInput
                style={commonStyles.input}
                placeholder="비상연락망2 를 입력해주세요."
                value={emergencyContact2}
                onChangeText={setEmergencyContact2}
                autoCapitalize="none"
              />
            </>
          )}
          <TouchableOpacity style={commonStyles.fixedFooter} onPress={nextStep}>
            <Text style={commonStyles.footerText}>다음</Text>
          </TouchableOpacity>
          {/* <HEButton style={commonStyles.fullWidthButton} title="다음" onPress={nextStep} /> */}
          {/* <View style={commonStyles.linkContainer}>
            <Text style={commonStyles.link} onPress={() => navigation.navigate('Login')}>
              이미 ID가 존재합니다. 로그인하시겠습니까?
            </Text>
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default Join;
