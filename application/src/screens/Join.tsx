import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, Image, BackHandler, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import api from '../../axios';
import axios from 'axios';
import Header from '../components/Header';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useCsrf } from '../../context/CsrfContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
interface Props {
  navigation: HomeScreenNavigationProp;
}

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&`~!@#$%^&*()_\-+=\\|{}[\]:;"'<>,.\/?])[A-Za-z\d@$!%*?&`~!@#$%^&*()_\-+=\\|{}[\]:;"'<>,.\/?]{8,}$/;
const idRegex = /^[a-zA-Z0-9]*$/;

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

  // 각 인풋의 ref 생성
  const idInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordCheckInputRef = useRef<TextInput>(null);
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const emergencyContact1InputRef = useRef<TextInput>(null);
  const emergencyContact2InputRef = useRef<TextInput>(null);

  // 뒤로가기 버튼 처리
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (step > 1) {
          setStep(step - 1);
          return true;
        } else {
          navigation.goBack();
          return true;
        }
      };

      // 뒤로가기 버튼 이벤트 리스너 추가
      BackHandler.addEventListener('hardwareBackPress', backAction);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [step])
  );

  const handleBackPress = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
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
    if (id.length > 4 && idRegex.test(id)) {
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
      Alert.alert('경고', '아이디는 5자 이상이며 영어와 숫자만 포함해야 합니다.');
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!allTermsAccepted) { // 모두 동의 체크 여부
        Alert.alert('경고', '모든 이용약관에 동의하셔야 다음으로 넘어갈 수 있습니다.');
        return;
      }
      setStep(2);
      idInputRef.current?.focus(); // 다음 단계로 넘어가면 ID 입력에 포커스
    } else if (step === 2) {
      if (!idck) {
        Alert.alert('경고', '아이디 중복 확인을 해주세요.');
        return;
      } if (!id) {
        Alert.alert('경고', '아이디를 입력해주세요.');
        return;
      } if (!idRegex.test(id)) {
        Alert.alert('경고', '아이디는 영어와 숫자만 포함해야 합니다.');
        return;
      } if (!password) {
        Alert.alert('경고', '비밀번호를 입력해주세요.');
        return;
      } if (!passwordRegex.test(password)) {
        Alert.alert('경고', '비밀번호는 영어, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.');
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
      if (!emailRegex.test(email) || /@\w*\d/.test(email)) {
        Alert.alert('경고', '유효한 이메일 주소를 입력해주세요.');
        return;
      } if (!phone) {
        Alert.alert('경고', '핸드폰 번호를 입력해주세요.');
        return;
      } if (!/^[0-9]{11}$/.test(phone)) {
        Alert.alert('경고', '핸드폰 번호는 숫자 11자여야 합니다.');
        return;
      }
      setStep(3);
      emergencyContact1InputRef.current?.focus(); // 다음 단계로 넘어가면 비상연락망1 입력에 포커스
    } else if (step === 3) {
      if (!emergencyContact1) {
        Alert.alert('경고', '비상연락망1을 입력해주세요.')
        return;
      } if (!emergencyContact2) {
        Alert.alert('경고', '비상연락망2을 입력해주세요.')
        return;
      }
      handleJoin();
    }
  };

  // 체크박스 상태 업데이트 함수
  const updateTerms = () => {
    const allAccepted = terms1Accepted && terms2Accepted;
    setAllTermsAccepted(allAccepted);
  };

  const handlePhoneInput = (value: string) => {
    // 핸드폰 번호는 숫자만 입력 가능하도록 처리
    const numericValue = value.replace(/[^0-9]/g, '');
    setPhone(numericValue);
  };

  return (
    <View style={commonStyles.containerWhite}>
    <KeyboardAvoidingView
      style={commonStyles.KeyboardAvoiding}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0} // 키보드 오버레이 오프셋 조정
    >
    <Header title="회원가입" onBackPress={handleBackPress} style={commonStyles.headerContainer} />
    <KeyboardAwareScrollView
      contentContainerStyle={commonStyles.keyboardAware}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={120} // 키보드가 올라올 때 추가로 스크롤 되는 높이 설
      enableAutomaticScroll={true}>
      <View style={commonStyles.formContainer}>
        <View style={commonStyles.innerContainerGray}>

          {step === 1 && (
            <>
              <View style={commonStyles.logoBox}>
                <Image
                  source={require('../assets/images/ThingQFulllogo.png')}
                  style={commonStyles.logoImage1}
                />
                <Text style={commonStyles.textGrayMediumLeft}>이용약관에 동의하시겠습니까?</Text>
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
                  <Text style={commonStyles.textBlackMediumB}>모두 동의</Text>
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
                    <Text onPress={() => navigation.navigate('TermsScreen', { termType: 'agreement' })} style={commonStyles.textGrayMedium}>
                      (필수) 서비스 이용 약관
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('TermsScreen', { termType: 'agreement' })}>
                    <Text> &gt; </Text>
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
                    <Text onPress={() => navigation.navigate('TermsScreen', { termType: 'privacy' })} style={commonStyles.textGrayMedium}>
                      (필수) 개인정보 수집·이용 약관
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('TermsScreen', { termType: 'privacy' })}>
                    <Text> &gt; </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
          
          {step === 2 && (
            <>
              <Text style={commonStyles.textInputTop}>
                ID <Text style={commonStyles.redAsterisk}>*</Text>
              </Text>
              <View style={commonStyles.view1}>
                <TextInput
                  ref={idInputRef}
                  style={commonStyles.input1}
                  placeholder="ID를 입력해주세요."
                  value={id}
                  onChangeText={setId}
                  autoCapitalize="none"
                  keyboardType="ascii-capable"
                  textContentType="username"
                  autoCorrect={false}
                />
                <HEButton
                  title="중복확인"
                  onPress={id_redundancy_check}
                  style={commonStyles.smallButton}
                />
              </View>
              <Text style={commonStyles.textInputTop}>
                비밀번호 <Text style={commonStyles.redAsterisk}>*</Text>
              </Text>
              <TextInput
                ref={passwordInputRef}
                style={commonStyles.input}
                placeholder="영어, 숫자, 특수문자를 포함 8자 이상 입력해주세요."
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={commonStyles.textInputTop}>
                비밀번호 확인 <Text style={commonStyles.redAsterisk}>*</Text>
              </Text>
              <TextInput
                ref={passwordCheckInputRef}
                style={commonStyles.input}
                placeholder="비밀번호를 한번 더 입력해주세요."
                secureTextEntry
                value={passwordCheck}
                onChangeText={setPasswordCheck}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={commonStyles.textInputTop}>
                이름 <Text style={commonStyles.redAsterisk}> *</Text>
              </Text>
              <TextInput
                ref={nameInputRef}
                style={commonStyles.input}
                placeholder="이름을 입력해주세요."
                value={name}
                onChangeText={setName}
                keyboardType="default"
                textContentType="name"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Text style={commonStyles.textInputTop}>
                E-mail <Text style={commonStyles.redAsterisk}> *</Text>
              </Text>
              <TextInput
                ref={emailInputRef}
                style={commonStyles.input}
                placeholder="E-mail을 입력해주세요."
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={commonStyles.textInputTop}>
                핸드폰 번호 <Text style={commonStyles.redAsterisk}>*</Text>
              </Text>
              <TextInput
                ref={phoneInputRef}
                style={commonStyles.input}
                placeholder="핸드폰 번호를 입력해주세요."
                value={phone}
                onChangeText={handlePhoneInput}
                keyboardType="number-pad"
                maxLength={11}
                autoCapitalize="none"
              />
            </>
          )}
          
          {step === 3 && (
            <>
              <Image
                source={require('../assets/images/ThingQFulllogo.png')}
                style={commonStyles.logoImage1}
              />
              <Text style={commonStyles.textInputTop}>비상연락망1 <Text style={commonStyles.redAsterisk}>*</Text></Text>
              <TextInput
                ref={emergencyContact1InputRef}
                style={commonStyles.input}
                placeholder="비상연락망1 을 입력해주세요."
                value={emergencyContact1}
                onChangeText={setEmergencyContact1}
                keyboardType="number-pad"
                maxLength={11}
                autoCapitalize="none"
              />
              <Text style={commonStyles.textInputTop}>비상연락망2 <Text style={commonStyles.redAsterisk}>*</Text></Text>
              <TextInput
                ref={emergencyContact2InputRef}
                style={commonStyles.input}
                placeholder="비상연락망2 를 입력해주세요."
                value={emergencyContact2}
                onChangeText={setEmergencyContact2}
                keyboardType="number-pad"
                maxLength={11}
                autoCapitalize="none"
              />
            </>
          )}
        </View>
      </View>
     
    </KeyboardAwareScrollView>
    <View >
      <TouchableOpacity style={commonStyles.fixedFooter} onPress={nextStep}>
        <Text style={commonStyles.footerText}>다음</Text>
      </TouchableOpacity>
    </View>
      
    </KeyboardAvoidingView>
    </View>
  );
};

export default Join;
