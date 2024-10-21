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
}

const Join : React.FC<Props> = ({csrfToken}) => {
  
  const [Id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birth, setBirth] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

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

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.view1}>
        <TextInput
          style={commonStyles.input1}
          placeholder="ID를 입력해주세요."
          value={Id}
          onChangeText={setId}
        />
        <TouchableOpacity
          style={commonStyles.input2}
          onPress={() => console.log("중복 확인 버튼 클릭됨")}>
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



