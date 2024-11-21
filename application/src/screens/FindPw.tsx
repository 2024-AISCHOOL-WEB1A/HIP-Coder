import React, { useState } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { csrfToken } = useCsrf();
    const route = useRoute();
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,4}$/;

    const handleFindPw = async () => {
        if (!userId || !userName || !email) {
            Alert.alert('오류', '아이디와 이름과 이메일을 모두 입력해주세요.');
            return;
        } else if (!emailRegex.test(email)) {
            Alert.alert('경고', '유효한 이메일 주소를 입력해주세요.');
            return;
        }

        // 로딩 상태 시작
        setIsLoading(true);

        try {
            // 이메일 전송 요청
            console.log('Sending request to /user/forgot-password with:', { id: userId, name: userName, email: email });
            await api.post(
                '/user/FindPw',
                { id: userId, name: userName, email: email },
                { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
            );

            // 이메일 전송 성공 메시지를 띄우고 페이지 이동
            Alert.alert('성공', '인증 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.', [
                {
                    text: '확인',
                    onPress: () => navigation.navigate('Login'),
                },
            ]);
            setIsEmailSent(true);
        } catch (error) {
            console.error('비밀번호 찾기 오류:', error);
            if (error.response && error.response.status === 404) {
                Alert.alert('오류', '입력하신 아이디, 이름 또는 이메일에 해당하는 사용자를 찾을 수 없습니다.');
            } else {
                Alert.alert('오류', '비밀번호 찾기 요청 중 오류가 발생했습니다.');
            }
            setIsEmailSent(false);
        } finally {
            // 로딩 상태 종료
            setIsLoading(false);
        }
    };

    const getIconColor = (screen: string) => {
        return route.name === screen ? '#3182f6' : '#9DA3B4';
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

            {/* 로딩 모달 */}
            <Modal
                visible={isLoading}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                }}
            >
                <View style={commonStyles.modalBackground}>
                    <View style={commonStyles.activityIndicatorWrapper}>
                        <ActivityIndicator size="large" color="#3182f6" />
                        <Text style={commonStyles.textBlue}>메일을 전송 중 입니다.</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default FindPw;
