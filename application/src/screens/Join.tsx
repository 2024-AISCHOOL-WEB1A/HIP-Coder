import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import CustomButton from '../components/CustomButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import api from '../../axios'


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  csrfToken: string | null;
}

const Join : React.FC<Props> = ({csrfToken}) => {
  
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

    const res = await api.post('/user/joindata', {
      email : email,
      password : password
    },
    {headers : {'X-CSRF-Token' : csrfToken}, withCredentials : true}
  )
    navigation.navigate('Login');
  };

  /** 아이디 중복확인 함수 */
  const id_redundancy_check = async () => {

    // 아이디 길이확인
    if (id.length > 4) { 
      const res = await api.post(
        '/user/idcheck',
        {idck : id},
        {headers : {'X-CSRF-Token': csrfToken}, withCredentials : true}
      )
      // 아이디 중복여부 체크
      if(res.data.message === '중복') {
        setIdck(false)
        Alert.alert('중복', '이미 사용 중인 아이디입니다.')
      } else if(res.data.message === '가능') {
        setIdck(true)
        Alert.alert('사용 가능한 아이디', '사용 가능한 아이디입니다.')
      }
    } else {
      Alert.alert('경고', '아이디 길이가 짧습니다.')
    }
  }

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.view1}>
        <TextInput
          style={commonStyles.input1}
          placeholder="ID를 입력해주세요."
          value={id}
          onChangeText={setId}
        />
        <TouchableOpacity
          style={commonStyles.input2}
          onPress={() => id_redundancy_check()}>
          <Text>중복 확인</Text>
        </TouchableOpacity>
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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => setGender('남성')}
          style={[commonStyles.radioButton, gender === '남성' && commonStyles.activeButton]}>
          <Text>남성</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGender('여성')}
          style={[commonStyles.radioButton, gender === '여성' && commonStyles.activeButton]}>
          <Text>여성</Text>
        </TouchableOpacity>
      </View>
    </View>
      <TextInput
        style={commonStyles.input}
        placeholder="Email을 입력해주세요."
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="생년월일을 입력해주세요. (예: 1990-01-01)"
        value={birth}
        onChangeText={setBirth}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="핸드폰 번호를 입력해주세요."
        value={phone}
        onChangeText={setPhone}
      />

      <CustomButton title="회원가입" onPress={handleJoin} />
      <CustomButton title="로그인" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default Join;



