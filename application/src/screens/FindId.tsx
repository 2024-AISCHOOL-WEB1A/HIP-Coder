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
    const { csrfToken } = useCsrf();

    const handleFindId = async () => {
        console.log('handleFindId called with name:', name, 'email:', email);
        if (!name || !email) {
            Alert.alert('오류', '이름과 이메일을 모두 입력해주세요.');
            return;
        }
    
        // 메일 전송 성공 메시지를 먼저 띄우고 페이지 이동
        Alert.alert('성공', '인증 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.');
        setIsEmailSent(true);
        sendEmail(); // 이메일 전송은 내부적으로 진행
    };

    const sendEmail = async () => {
        try {
            // 이메일 전송 요청
            console.log('Sending request to /user/forgot-id with:', { USER_NAME: name, EMAIL: email });
            await api.post(
                '/user/FindId',
                { USER_NAME: name, EMAIL: email },
                { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
            );
            // 이메일 전송 후 성공 로그
            console.log('Email sent successfully');
        } catch (error) {
            console.error('아이디 찾기 오류:', error);
            if (error.response && error.response.status === 404) {
                Alert.alert('오류', '입력하신 이름과 이메일에 해당하는 사용자를 찾을 수 없습니다.');
            } else {
                Alert.alert('오류', '아이디 찾기 요청 중 오류가 발생했습니다.');
            }
            setIsEmailSent(false);
        }
    };

    const handleVerification = async (verificationToken: string) => {
        // console.log('handleVerification called with token:', verificationToken);
        try {
            const res = await api.get(`/user/verify-id/${verificationToken}`);
            // console.log('Verification response:', res.data);
            setIsEmailSent(false); // 이메일 전송 상태 초기화
        } catch (error) {
            console.error('인증 오류:', error);
            Alert.alert('오류', '유효하지 않거나 만료된 링크입니다.');
        }
    };

    const processUrl = async (url: string) => {
        // console.log('Processing URL:', url);
        try {
            const parsedUrl = new URL(url);
            const token = parsedUrl.pathname.split('/').pop();
            // console.log('Extracted token from URL:', token);
            if (token) {
                await handleVerification(token);
            }
        } catch (error) {
            console.error('URL 처리 중 오류:', error);
        }
    };

    useEffect(() => {
        // console.log('useEffect triggered');
        // 앱이 실행된 후 처음 호출된 URL을 처리
        const getInitialURL = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();
                // console.log('Initial URL:', initialUrl);
                if (initialUrl) {
                    await processUrl(initialUrl);
                }
            } catch (error) {
                console.error('초기 URL 가져오기 오류:', error);
            }
        };
    
        // 딥 링크가 호출될 때마다 URL을 처리
        const handleOpenURL = (event: { url: string }) => {
            // console.log('handleOpenURL called with event URL:', event.url);
            processUrl(event.url);
        };
    
        getInitialURL(); // 앱이 처음 실행될 때 초기 URL 처리
    
        // 최신 방식으로 이벤트 리스너 등록
        const subscription = Linking.addEventListener('url', handleOpenURL);
    
        return () => {
            // console.log('Cleaning up event listener');
            subscription.remove(); // 컴포넌트 언마운트 시 리스너 해제
        };
    }, []);

    return (
        <View style={commonStyles.container}>
            <View style={commonStyles.headerContainer}>
                <Header onBackPress={() => {
                    // console.log('Back button pressed');
                    navigation.goBack();
                }} />
            </View>
            <View style={commonStyles.formContainer}>
                <View style={commonStyles.innerContainer}>
                    {!isEmailSent ? (
                        <>
                            <Text style={commonStyles.text1}>이름과 이메일을 입력하세요.</Text>
                            <TextInput
                                value={name}
                                onChangeText={(text) => {                                 
                                    setName(text);
                                }}
                                placeholder="이름을 입력하세요."
                                style={commonStyles.input}
                            />
                            <TextInput
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                }}
                                placeholder="이메일을 입력하세요."
                                keyboardType="email-address"
                                style={commonStyles.input}
                            />
                            <HEButton style={commonStyles.fullWidthButton} title="아이디 찾기" onPress={() => {
                                // console.log('Find ID button pressed');
                                handleFindId();
                            }} />
                        </>
                    ) : (
                        <>
                            <Text style={commonStyles.text2}>이메일을 확인하고, 인증 링크를 클릭하세요.</Text>
                            <View style={styles.buttonContainer}>
                                <HEButton
                                    style={commonStyles.fullWidthButton}
                                    title="로그인 페이지로 돌아가기"
                                    onPress={() => navigation.navigate('Login')}
                                />
                                <HEButton
                                    style={commonStyles.fullWidthButton}
                                    title="비밀번호 찾기"
                                    onPress={() => navigation.navigate('FindPassword')}
                                />
                            </View>
                        </>
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
    buttonContainer: {
        marginTop: 20,
    },
});

export default FindId;
