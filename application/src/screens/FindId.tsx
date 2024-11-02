import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const FindId: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleFindId = async () => {
        if (!name || !email) {
            Alert.alert('오류', '이름과 이메일을 모두 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/user/forgot-id', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ USER_NAME: name, EMAIL: email }), // 이름과 이메일을 서버로 전송
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('성공', data.message);
            } else {
                Alert.alert('오류', data.error);
            }
        } catch (error) {
            console.error('아이디 찾기 요청 중 오류 발생:', error);
            Alert.alert('오류', '서버와의 통신 중 오류가 발생했습니다.');
        }
    };

    return (
        <View style={commonStyles.container}>
            <View style={commonStyles.headerContainer}>
                <Header onBackPress={() => navigation.goBack()} />
                <Text style={commonStyles.headerTitle}>아이디 찾기</Text>
            </View>
            <View style={commonStyles.formContainer}>
                <View style={commonStyles.innerContainer}>
                    <Text style={commonStyles.text1}>이름과 이메일을 입력하세요.</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="이름을 입력하세요."
                        style={commonStyles.input}
                    />
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="이메일을 입력하세요."
                        keyboardType="email-address"
                        style={commonStyles.input}
                    />
                    <HEButton style={commonStyles.fullWidthButton} title="아이디 찾기"  onPress={handleFindId} />
                    <Text style={commonStyles.text2}>
                        {'\n'}{'\n'}{'\n'}아이디 찾기를 통해 필요한 정보를 얻으세요.
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default FindId;
