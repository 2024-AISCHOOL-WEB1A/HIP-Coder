import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import CustomButton from '../components/CustomButton';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log("로그인 정보:", { email, password });
    navigation.navigate('Home');
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>로그인</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <CustomButton title="로그인" onPress={handleLogin} />
      <CustomButton title="회원가입" onPress={() => navigation.navigate('Join')} />
      {/* <Text style={commonStyles.link} onPress={() => navigation.navigate('Join')}>
        회원가입을 원하시면 여기를 누르세요.
      </Text> */}
    </View>
  );
};

export default Login;