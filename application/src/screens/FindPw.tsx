import React, { useState } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/Header';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import api from '../../axios';
import { useCsrf } from '../../context/CsrfContext';
import Icon from 'react-native-vector-icons/Ionicons';

const FindPw: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
    const [userId, setUserId] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
    const { csrfToken } = useCsrf();
    const route = useRoute();
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,4}$/;

const handleFindId = async () => {
    console.log('handleFindId called with name:', name, 'email:', email);
    
    // 이름과 이메일 입력 확인
    if (!name || !email) {
        Alert.alert('오류', '이름과 이메일을 모두 입력해주세요.');
        return; // 입력 오류 시 여기서 종료
    }

    // 이메일 형식 검증
    if (!emailRegex.test(email) || /@\w*\d/.test(email)) {
        Alert.alert('경고', '유효한 이메일 주소를 입력해주세요.');
        return; // 이메일 형식 오류 시 여기서 종료
    }

    // 이메일 전송 시도 (입력값이 올바른 경우에만 실행됨)
    try {
        console.log('Sending request to /user/FindId with:', { USER_NAME: name, EMAIL: email });
        const response = await api.post(
            '/user/FindId',
            { USER_NAME: name, EMAIL: email },
            { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
        );

        // 백엔드 요청 성공 시에만 성공 Alert를 띄우고 화면 전환
        console.log('Email sent successfully:', response.data);
        Alert.alert('성공', '인증 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.', [
            {
                text: '확인',
                onPress: () => {
                    navigation.navigate('Login'); // 메인 페이지로 즉시 이동
                }
            },
        ]);
    } catch (error) {
        console.error('아이디 찾기 요청 중 오류가 발생했습니다.', error);
        
        // 오류 발생 시 적절한 경고 메시지를 표시
        if (error.response && error.response.status === 404) {
            Alert.alert('경고', '입력하신 이름과 이메일에 해당하는 사용자를 찾을 수 없습니다.');
        } else {
            Alert.alert('경고', '아이디 찾기 요청 중 오류가 발생했습니다.');
        }
    }
};

    return (
        <View style={commonStyles.containerWhite}>
            <View style={commonStyles.headerContainer}>
                <Header title="비밀번호 찾기" onBackPress={() => navigation.goBack()} />
            </View>
            <View style={commonStyles.formContainer}>
                <Image
                    source={{ uri: 'https://jsh-1.s3.ap-northeast-2.amazonaws.com/hipcoder/ThingQFulllogo.png'}}
                    style={commonStyles.logoImage}
                     />
                <View style={commonStyles.innerContainerGray}>
                    <Text style={commonStyles.textMarginBottom}>비밀번호를 찾으려면 아래 정보를 입력하세요.</Text>
                    <TextInput
                        style={commonStyles.input}
                        placeholder="아이디"
                        value={userId}
                        onChangeText={setUserId}
                        autoCapitalize="none"
                        keyboardType="ascii-capable"
                        textContentType="username"
                        autoCorrect={false}
                    />
                    <TextInput
                        style={commonStyles.input}
                        placeholder="이름"
                        value={userName}
                        onChangeText={setUserName}
                        keyboardType="default"
                        textContentType="name"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={commonStyles.input}
                        placeholder="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <HEButton style={commonStyles.fullWidthButton} title="비밀번호 찾기" onPress={handleFindPw} />
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


export default FindPw;
