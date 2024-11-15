import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Linking, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/Header';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import api from '../../axios';
import { useCsrf } from '../../context/CsrfContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const FindId: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const { csrfToken } = useCsrf();

    const handleFindId = async () => {
        console.log('handleFindId called with name:', name, 'email:', email);
        if (!name || !email) {
            Alert.alert('오류', '이름과 이메일을 모두 입력해주세요.');
            return;
        }

        // 성공 메시지 표시 후 확인 버튼 클릭 시 메인 페이지로 즉시 이동
        Alert.alert('성공', '인증 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.', [
            {
                text: '확인',
                onPress: () => navigation.navigate('Login'), // 메인 페이지로 즉시 이동
            },
        ]);

        // 이메일 전송은 내부적으로 처리
        try {
            console.log('Sending request to /user/FindId with:', { USER_NAME: name, EMAIL: email });
            await api.post(
                '/user/FindId',
                { USER_NAME: name, EMAIL: email },
                { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
            );
            console.log('Email sent successfully');
        } catch (error) {
            console.error('아이디 찾기 오류:', error);
            if (error.response && error.response.status === 404) {
                console.error('입력하신 이름과 이메일에 해당하는 사용자를 찾을 수 없습니다.');
            } else {
                console.error('아이디 찾기 요청 중 오류가 발생했습니다.');
            }
        }
    };

    const processUrl = async (url: string) => {
        try {
            const parsedUrl = new URL(url);
            const token = parsedUrl.pathname.split('/').pop();
            if (token) {
                await handleFindId();
            }
        } catch (error) {
            console.error('URL 처리 중 오류:', error);
        }
    };

    useEffect(() => {
        const getInitialURL = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();
                if (initialUrl) {
                    await processUrl(initialUrl);
                }
            } catch (error) {
                console.error('초기 URL 가져오기 오류:', error);
            }
        };

        const handleOpenURL = (event: { url: string }) => {
            processUrl(event.url);
        };

        getInitialURL();

        const subscription = Linking.addEventListener('url', handleOpenURL);

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <View style={commonStyles.containerGray}>
            <View style={commonStyles.headerContainer}>
                <Header
                    title="ID 찾기"
                    onBackPress={() => navigation.goBack()}
                />
            </View>
            <View style={commonStyles.formContainer}>
                <View style={commonStyles.innerContainerGray}>
                    <Text style={commonStyles.textMarginBottom}>이름과 이메일을 입력하세요.</Text>
                    <TextInput
                        value={name}
                        onChangeText={(text) => setName(text)}
                        placeholder="이름을 입력하세요."
                        style={commonStyles.input}
                    />
                    <TextInput
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="이메일을 입력하세요."
                        keyboardType="email-address"
                        style={commonStyles.input}
                    />
                    <HEButton
                        style={commonStyles.fullWidthButton}
                        title="아이디 찾기"
                        onPress={handleFindId}
                    />
                    <Image 
                        source={require('../assets/images/ThingQFulllogo.png')}
                        style={commonStyles.logoImage1}
                    />
                </View>
            </View>
        </View>
    );
};

export default FindId;
