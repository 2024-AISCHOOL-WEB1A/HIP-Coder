import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Linking, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/Header';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import api from '../../axios';
import { useCsrf } from '../../context/CsrfContext';
import Icon from 'react-native-vector-icons/Ionicons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const FindId: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const { csrfToken } = useCsrf();
    const route = useRoute();
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,4}$/;

    const handleFindId = async () => {
        console.log('handleFindId called with name:', name, 'email:', email);
        if (!name || !email) {
            Alert.alert('오류', '이름과 이메일을 모두 입력해주세요.');
            return;
        } else if (!emailRegex.test(email) || /@\w*\d/.test(email)) {
            Alert.alert('경고', '유효한 이메일 주소를 입력해주세요.');
            return;
        }
    
        // 성공 메시지 표시 후 바로 화면 이동 (메일 발송 비동기 처리)
        Alert.alert('성공', '인증 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.', [
            {
                text: '확인',
                onPress: () => navigation.navigate('Login'), // 메인 페이지로 즉시 이동
            },
        ]);
    
        // 이메일 전송은 내부적으로 비동기 처리
        try {
            console.log('Sending request to /user/FindId with:', { USER_NAME: name, EMAIL: email });
            await api.post(
                '/user/FindId',
                { USER_NAME: name, EMAIL: email },
                { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
            );
            console.log('Email sent successfully');
        } catch (error) {
            console.error('아이디 찾기 요청 중 오류가 발생했습니다.', error);
    
            // 오류 메시지 처리 (화면 전환 후에 처리되므로 사용자에게 영향을 주지 않음)
            if (error.response && error.response.status === 404) {
                Alert.alert('경고', '입력하신 이름과 이메일에 해당하는 사용자를 찾을 수 없습니다.');
            } else {
                Alert.alert('경고', '아이디 찾기 요청 중 오류가 발생했습니다.');
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
            // console.error('URL 처리 중 오류:', error);
            Alert.alert('경고', 'URL 처리 중 오류가 발생 했습니다.')
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
                // console.error('초기 URL 가져오기 오류:', error);
                Alert.alert('경고', '초기 URL 가져오기 오류')
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

    const getIconColor = (screen: string) => {
        return route.name === screen ? '#3182f6' : '#9DA3B4';
      };

    return (
        <View style={commonStyles.containerWhite}>
            <View style={commonStyles.headerContainer}>
                <Header title="ID 찾기" onBackPress={() => navigation.goBack()} />
            </View>
                <Image 
                   source={{ uri: 'https://jsh-1.s3.ap-northeast-2.amazonaws.com/hipcoder/ThingQFulllogo.png'}}
                    style={commonStyles.logoImage}
                />

            <View style={commonStyles.formContainer}>
                <View style={commonStyles.innerContainerGray}>
                    <Text style={commonStyles.textMarginBottom}>ID를 찾으려면 아래 정보를 입력하세요.</Text>
                    <TextInput
                        value={name}
                        onChangeText={(text) => setName(text)}
                        placeholder="이름을 입력하세요."
                        style={commonStyles.input}
                    />
                    <TextInput
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="E-mail을 입력하세요."
                        keyboardType="email-address"
                        style={commonStyles.input}
                    />
                    <HEButton
                        style={commonStyles.fullWidthButton}
                        title="아이디 찾기"
                        onPress={handleFindId}
                    />
                </View>
            </View>
            
        <View style={commonStyles.navBar}>
            <TouchableOpacity style={[commonStyles.navButton, commonStyles.touchableAreaHorizontal]} onPress={() => navigation.navigate('Home')}>
                <Icon name="home" size={24} color={getIconColor('Home')} />
            </TouchableOpacity>
            <TouchableOpacity style={[commonStyles.navButton, commonStyles.touchableAreaHorizontal]} onPress={() => navigation.navigate('History')}>
                <Icon name="time-outline" size={24} color={getIconColor('History')} />
            </TouchableOpacity>
            <TouchableOpacity style={[commonStyles.navButton, commonStyles.touchableAreaHorizontal]} onPress={() => navigation.navigate('MyPage')}>
                <Icon name="person-outline" size={24} color={getIconColor('MyPage')} />
            </TouchableOpacity>
        </View>
    </View>
    );
};

export default FindId;
