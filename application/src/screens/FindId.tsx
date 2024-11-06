import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import api from '../../axios';

import { useCsrf } from '../../context/CsrfContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const FindId: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const { csrfToken } = useCsrf();

    const handleFindId = async () => {
        if (!name || !email) {
            Alert.alert('오류', '이름과 이메일을 모두 입력해주세요.');
            return;
        }
    
        // Alert 메시지를 먼저 띄웁니다.
        Alert.alert('알림', '이메일 전송 중입니다. 잠시만 기다려 주세요.');
    
        try {
            // 이메일 전송 요청
            await api.post(
                '/user/forgot-id',
                { USER_NAME: name, EMAIL: email },
                { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
            );
    
            // 이메일 전송 후 성공 메시지 표시
            Alert.alert('성공', '인증 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.');
            setIsEmailSent(true);
        } catch (error) {
            console.error('아이디 찾기 오류:', error);
            Alert.alert('오류', '아이디 찾기 요청 중 오류가 발생했습니다.');
            // 이메일 전송 실패 시 상태 원복
            setIsEmailSent(false);
        }
    };
    

    const handleVerification = async (verificationToken: string) => {
        try {
            const res = await api.get(`/user/verify-id/${verificationToken}`);
            setUserId(res.data.user_id);
        } catch (error) {
            console.error('인증 오류:', error);
            Alert.alert('오류', '유효하지 않거나 만료된 링크입니다.');
        }
    };

    useEffect(() => {
        // 앱이 실행된 후 처음 호출된 URL을 처리
        const getInitialURL = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();
                if (initialUrl) {
                    console.log('Initial URL:', initialUrl);
                    const url = new URL(initialUrl);
                    const token = url.pathname.split('/').pop();
                    if (token) {
                        await handleVerification(token);
                    }
                }
            } catch (error) {
                console.error('초기 URL 가져오기 오류:', error);
            }
        };
    
        // 딥 링크가 호출될 때마다 URL을 처리
        const handleOpenURL = async (event: { url: string }) => {
            try {
                console.log('Deep link event URL:', event.url);
                const url = new URL(event.url);
                const token = url.pathname.split('/').pop();
                if (token) {
                    await handleVerification(token);
                }
            } catch (error) {
                console.error('URL 처리 중 오류:', error);
            }
        };
    
        getInitialURL(); // 앱이 처음 실행될 때 초기 URL 처리
    
        // 최신 방식으로 이벤트 리스너 등록
        const subscription = Linking.addListener('url', handleOpenURL);
    
        return () => {
            subscription.remove(); // 컴포넌트 언마운트 시 리스너 해제
        };
    }, []);
    

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
                        <>
                            <Text style={styles.userIdText}>당신의 아이디는: {userId}</Text>
                            <HEButton
                                style={commonStyles.fullWidthButton}
                                title="로그인 하러 가기"
                                onPress={() => navigation.navigate('Login')}
                            />
                        </>
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
