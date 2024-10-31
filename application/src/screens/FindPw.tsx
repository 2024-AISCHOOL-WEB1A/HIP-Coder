import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const FindPw: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [userId, setUserId] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleFindPw = async () => {
        if (!userId || !userName || !email) {
            Alert.alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('http://your-backend-url/forgot-password', {
                method: 'POST', // 필요에 따라 GET 또는 POST 사용
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId, name: userName, email: email }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert(data.message); // 성공 메시지
            } else {
                Alert.alert(data.error); // 에러 메시지
            }
        } catch (error) {
            console.error('비밀번호 찾기 오류:', error);
            Alert.alert('서버 오류가 발생했습니다.');
        }
    };

    return (
        <View style={commonStyles.container}>
            <View style={commonStyles.headerContainer}>
                <Header onBackPress={() => navigation.goBack()} />
                <Text style={commonStyles.headerTitle}>비밀번호 찾기</Text>
            </View>
            <View style={commonStyles.formContainer}>
                <View style={commonStyles.innerContainer}>
                    <Text style={commonStyles.text1}>비밀번호를 찾으려면 아래 정보를 입력하세요.</Text>
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
                    <Button title="비밀번호 찾기" onPress={handleFindPw} />
                    <Text style={commonStyles.text2}>
                        {'\n'}{'\n'}비밀번호 찾기를 통해 필요한 정보를 얻으세요.
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default FindPw;
