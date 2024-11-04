import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import api from '../../axios';
import { useCsrf } from '../../context/CsrfContext'; // 여기 추가

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const FindId: React.FC = () => {
    const { csrfToken } = useCsrf(); // 여기에서 CSRF 토큰을 가져옴
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);

    const handleFindId = async () => {
        if (!name || !email) {
            Alert.alert('오류', '이름과 이메일을 모두 입력해주세요.');
            return;
        }

        try {
            const res = await api.post(
                '/user/forgot-id',
                { USER_NAME: name, EMAIL: email },
                { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
            );
            setIsEmailSent(true);
            Alert.alert('성공', '인증 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.');
        } catch (error) {
            console.error('아이디 찾기 오류:', error);
            Alert.alert('오류', '아이디 찾기 요청 중 오류가 발생했습니다.');
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
                    {!isEmailSent ? (
                        <>
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
                            <HEButton style={commonStyles.fullWidthButton} title="아이디 찾기" onPress={handleFindId} />
                        </>
                    ) : userId ? (
                        <Text style={styles.userIdText}>당신의 아이디는: {userId}</Text>
                    ) : (
                        <Text style={commonStyles.text2}>이메일을 확인하고, 인증 링크를 클릭하세요.</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    userIdText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default FindId;
