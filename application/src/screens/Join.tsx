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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
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


