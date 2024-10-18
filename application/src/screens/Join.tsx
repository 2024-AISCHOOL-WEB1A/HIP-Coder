import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
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
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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