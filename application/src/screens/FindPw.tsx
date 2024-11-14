import React, { useState } from 'react';
import { View, TextInput, Alert, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import api from '../../axios';
import { useCsrf } from '../../context/CsrfContext';

const FindPw: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
    const [userId, setUserId] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
    const { csrfToken } = useCsrf();

    const handleFindPw = async () => {
        if (!userId || !userName || !email) {
            Alert.alert('오류', '모든 필드를 입력해주세요.');
            return;
        }

        // 메일 전송 성공 메시지를 먼저 띄우고 페이지 이동
        Alert.alert('성공', '인증 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.', [
            {
                text: '확인',
                onPress: () => {
                    navigation.navigate('Login');
                    sendEmail(); // 이메일 전송은 내부적으로 진행
                },
            },
        ]);
        setIsEmailSent(true);
    };

    const sendEmail = async () => {
        try {
            // 이메일 전송 요청
            console.log('Sending request to /user/forgot-password with:', { id: userId, name: userName, email: email });
            await api.post(
                '/user/FindPw',
                { id: userId, name: userName, email: email },
                { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
            );
            // 이메일 전송 후 성공 로그
            console.log('Email sent successfully');
        } catch (error) {
            console.error('비밀번호 찾기 오류:', error);
            if (error.response && error.response.status === 404) {
                Alert.alert('오류', '입력하신 아이디, 이름 또는 이메일에 해당하는 사용자를 찾을 수 없습니다.');
            } else {
                Alert.alert('오류', '비밀번호 찾기 요청 중 오류가 발생했습니다.');
            }
            setIsEmailSent(false);
        }
    };

    return (
        <View style={commonStyles.container}>
            <View style={commonStyles.headerContainer}>
                <Header title="비밀번호 찾기" onBackPress={() => navigation.goBack()} />
            </View>
            <View style={commonStyles.formContainer}>
                <View style={commonStyles.innerContainer}>
                    <Text style={commonStyles.textMarginBottom}>비밀번호를 찾으려면 아래 정보를 입력하세요.</Text>
                    <TextInput
                        style={commonStyles.input}
                        placeholder="아이디"
                        value={userId}
                        onChangeText={setUserId}
                    />
                    <TextInput
                        style={commonStyles.input}
                        placeholder="이름"
                        value={userName}
                        onChangeText={setUserName}
                    />
                    <TextInput
                        style={commonStyles.input}
                        placeholder="이메일"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <HEButton style={commonStyles.fullWidthButton} title="비밀번호 찾기" onPress={handleFindPw} />
                </View>
            </View>
        </View>
    );
};

export default FindPw;
