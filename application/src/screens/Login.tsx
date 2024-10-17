import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';

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
      <Text style={commonStyles.header}>Login</Text>
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
      <Button title="Login" onPress={handleLogin} />
      <Text style={commonStyles.link} onPress={() => navigation.navigate('Join')}>
        회원가입을 원하시면 여기를 누르세요.
      </Text>
    </View>
  );
};

export default Login;