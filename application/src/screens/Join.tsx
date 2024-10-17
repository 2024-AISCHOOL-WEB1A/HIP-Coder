import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import CustomButton from '../components/CustomButton';

const Join = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();

  const handleJoin = () => {
    console.log("회원 가입 정보:", { email, password });
    navigation.navigate('Login');
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>Join</Text>
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
      <Button title="Join" onPress={handleJoin} />
      <Text style={commonStyles.link} onPress={() => navigation.navigate('Login')}>
        이미 계정이 있으십니까? 로그인하시려면 여기를 클릭하세요.
      </Text>
    </View>
  );
};

export default Join;