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
            // console.error('아이디 찾기 오류:', error);
            Alert.alert('경고', '아이디 찾기 오류 처리 중 오류가 발생했습니다.')
            if (error.response && error.response.status === 404) {
                // console.error('입력하신 이름과 이메일에 해당하는 사용자를 찾을 수 없습니다.');
                Alert.alert('경고', '입력하신 이름과 이메일에 해당하는 사용자를 찾을 수 없습니다.')
            } else {
                Alert.alert('경고', '아이디 찾기 요청 중 오류가 발생했습니다.')
                // console.error('아이디 찾기 요청 중 오류가 발생했습니다.');
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
        <View style={commonStyles.containerGray}>
            <View style={commonStyles.headerContainer}>
                <Header
                    title="ID 찾기"
                    onBackPress={() => navigation.goBack()}
                />
            </View>
                    <Image 
                        source={require('../assets/images/ThingQFulllogo.png')}
                        style={commonStyles.logoImage1}
                    />
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
                </View>
            </View>
        <View style={styles.navBar}>
            <TouchableOpacity style={[styles.navButton, styles.touchableAreaHorizontal]} onPress={() => navigation.navigate('Home')}>
            <Icon name="home" size={24} color={getIconColor('Home')} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navButton, styles.touchableAreaHorizontal]} onPress={() => navigation.navigate('History')}>
            <Icon name="time-outline" size={24} color={getIconColor('History')} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navButton, styles.touchableAreaHorizontal]} onPress={() => navigation.navigate('MyPage')}>
            <Icon name="person-outline" size={24} color={getIconColor('MyPage')} />
            </TouchableOpacity>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({

    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#E0E0E0',
        height: 60,
      },
      navButton: {
        padding: 10,
      },
      touchableAreaHorizontal: {
        paddingHorizontal: 50, // 좌우로 터치 가능한 영역을 확장하여 버튼 클릭이 더 쉽게 됩니다.
        paddingVertical: 10,  // 상하 패딩은 줄여서, 좌우로만 영역을 확장.
      },

})

export default FindId;
