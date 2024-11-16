import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import CustomButton from '../components/IJButton';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCsrf } from '../../context/CsrfContext';
import api from '../../axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileData {
  name: string;
  phone: string;
  email: string;
  emergencyContact1: string;
  emergencyContact2: string;
}

interface Passwords {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&`~!@#$%^&*()_\-+=\\|{}\[\]:;"'<>,.\/\?])[A-Za-z\d@$!%*?&`~!@#$%^&*()_\-+=\\|{}\[\]:;"'<>,.\/\?]{8,}$/;

const MyPage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    phone: '',
    email: '',
    emergencyContact1: '',
    emergencyContact2: '',
  });
  const [passwords, setPasswords] = useState<Passwords>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { csrfToken } = useCsrf();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 전화번호 포맷 함수
  const formatPhoneNumber = (number: string): string => {
    if (number.length === 11) {
      return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`;
    } else if (number.length === 10) {
      return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6)}`;
    }
    return number;
  };

  // 전화번호 형식 제거 함수 (서버 전송용)
  const unformatPhoneNumber = (formattedNumber: string): string => {
    return formattedNumber.replace(/-/g, '');
  };

  // 로그인 상태 확인
  const checkIsLoggedIn = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('accessToken');
    // 네비게이션 스택 초기화 후 홈 화면으로 이동
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkIsLoggedIn();
    mypagelist();
  }, []);

  const mypagelist = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('오류', '로그인이 필요합니다. 홈 화면으로 이동합니다.', [
          {
            text: '확인',
            onPress: () => {
              handleLogout(); // 로그아웃 처리 후 홈으로 이동
            },
          },
        ]);
        return;
      }

      const res = await api.post(
        '/user/mypage',
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        }
      );

      if (res.data && Array.isArray(res.data.message)) {
        const userData = res.data.message[0];
        setProfileData({
          name: userData.USER_NAME,
          phone: formatPhoneNumber(userData.PHONE),
          email: userData.EMAIL,
          emergencyContact1: formatPhoneNumber(userData.CONTACT_INFO1 || ''),
          emergencyContact2: formatPhoneNumber(userData.CONTACT_INFO2 || ''),
        });
      } else {
        console.error('잘못된 데이터 형식:', res.data);
        Alert.alert('오류', '서버로부터 잘못된 형식의 데이터가 반환되었습니다.');
      }
    } catch (error) {
      Alert.alert('세션 만료', '세션이 만료되었습니다. 홈 화면으로 이동합니다.', [
        {
          text: '확인',
          onPress: async () => {
            await handleLogout(); // 로그아웃 처리
            // 홈 화면으로 이동하고 네비게이션 스택을 초기화
            navigation.dispatch(
              CommonActions.reset({
                index: 0, // 초기 인덱스를 설정
                routes: [{ name: 'Home' }], // 홈 화면을 네비게이션 스택에 추가
              })
            );
          }
        },
      ]);
    }
  };

  const handleProfileUpdate = async () => {
    if (isEditing) {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('오류', '로그인이 필요합니다. 로그인 페이지로 이동합니다.', [
            { text: '확인', onPress: () => navigation.navigate('Login') },
          ]);
          return;
        }

        // 서버로 전송할 때 포맷된 전화번호를 원래 형태로 변환
        const formattedProfileData = {
          ...profileData,
          phone: unformatPhoneNumber(profileData.phone),
          emergencyContact1: unformatPhoneNumber(profileData.emergencyContact1),
          emergencyContact2: unformatPhoneNumber(profileData.emergencyContact2),
        };

        const response = await api.post(
          '/user/update',
          {
            emergencyContact1: formattedProfileData.emergencyContact1,
            emergencyContact2: formattedProfileData.emergencyContact2,
          },
          { headers: { 'X-CSRF-Token': csrfToken, 'Authorization': `Bearer ${token}` }, withCredentials: true }
        );

        if (response.status === 200) {
          Alert.alert('알림', '프로필이 성공적으로 수정되었습니다.');
          // 수정 완료 후 전화번호 형식을 다시 포맷
          setProfileData({
            ...profileData,
            phone: formatPhoneNumber(formattedProfileData.phone),
            emergencyContact1: formatPhoneNumber(formattedProfileData.emergencyContact1),
            emergencyContact2: formatPhoneNumber(formattedProfileData.emergencyContact2),
          });
        } else {
          Alert.alert('오류', response.data.error || '프로필 수정에 실패했습니다.');
        }
      } catch (error) {
        Alert.alert('오류', '서버와의 통신 중 문제가 발생했습니다.');
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordRegex.test(passwords.newPassword)) {
      Alert.alert('오류', '새 비밀번호는 8자 이상이어야 하며, 문자, 숫자, 특수문자를 포함해야 합니다.');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      Alert.alert('오류', '새 비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다. 로그인 페이지로 이동합니다.', [
          { text: '확인', onPress: () => navigation.navigate('Login') },
        ]);
        return;
      }

      const res = await api.post(
        '/user/changePassword',
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        },
        { headers: { 'X-CSRF-Token': csrfToken, 'Authorization': `Bearer ${token}` }, withCredentials: true }
      );

      if (res.status === 200) {
        Alert.alert('알림', '비밀번호가 성공적으로 변경되었습니다.');
        navigation.navigate('Home');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        Alert.alert('오류', res.data.error || '비밀번호 변경 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 변경 요청 오류:', error);
      Alert.alert('오류', '비밀번호 변경 요청 중 오류가 발생했습니다.');
    }
  };

  const handleWithdrawal = async () => {
    Alert.alert(
      '회원 탈퇴',
      '정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('accessToken');
              if (!token) {
                Alert.alert('오류', '로그인이 필요합니다. 로그인 페이지로 이동합니다.', [
                  { text: '확인', onPress: () => navigation.navigate('Login') },
                ]);
                return;
              }

              const response = await api.post('/user/withdrawal', {}, {
                headers: { 'X-CSRF-Token': csrfToken, 'Authorization': `Bearer ${token}` },
                withCredentials: true,
              });

              if (response.status === 200) {
                await AsyncStorage.removeItem('accessToken');
                Alert.alert('알림', '회원 탈퇴가 완료되었습니다.');
                navigation.navigate('Login');
              } else {
                Alert.alert('오류', response.data.error || '회원 탈퇴 중 오류가 발생했습니다.');
              }
            } catch (error) {
              console.error('회원 탈퇴 요청 오류:', error);
              Alert.alert('오류', '회원 탈퇴 요청 중 오류가 발생했습니다.');
            }
          }
        }
      ]
    );
  };


  const getIconColor = (screen: string) => {
    return route.name === screen ? '#3182f6' : '#9DA3B4';
  };
  return (
    <View style={styles.container}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} title="내정보" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>프로필 정보</Text>
          <View style={styles.card}>
            <TextInput style={[styles.input, styles.fullInput, { backgroundColor: '#F0F0F0' }]} placeholder="이름" value={profileData.name} editable={false} />
            <TextInput
              style={[styles.input, styles.fullInput, { backgroundColor: '#F0F0F0' }]}
              placeholder="핸드폰번호"
              value={profileData.phone}
              editable={false} // 수정 모드에서도 수정되지 않도록 설정
            />
            <TextInput style={[styles.input, { backgroundColor: '#F0F0F0' }]} placeholder="이메일" value={profileData.email} editable={false} />
            <Text style={styles.emergencyContactTitle}>비상연락망(1)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isEditing ? '#FFFFFF' : '#F0F0F0' }]}
              placeholder="비상연락망(1)"
              value={isEditing ? unformatPhoneNumber(profileData.emergencyContact1) : profileData.emergencyContact1}
              onChangeText={(text) => {
                if (text.length <= 11) {
                  setProfileData({ ...profileData, emergencyContact1: text });
                }
              }}
              editable={isEditing}
              keyboardType="numeric"
            />
            <Text style={styles.emergencyContactTitle}>비상연락망(2)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isEditing ? '#FFFFFF' : '#F0F0F0' }]}
              placeholder="비상연락망(2)"
              value={isEditing ? unformatPhoneNumber(profileData.emergencyContact2) : profileData.emergencyContact2}
              onChangeText={(text) => {
                if (text.length <= 11) {
                  setProfileData({ ...profileData, emergencyContact2: text });
                }
              }}
              editable={isEditing}
              keyboardType="numeric"
            />
            <CustomButton title={isEditing ? "완료" : "프로필 수정"} onPress={handleProfileUpdate} style={styles.actionButton} />
          </View>
        </View>

        {/* 비밀번호 변경 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>비밀번호 변경</Text>
          <View style={styles.card}>
            <TextInput style={styles.input}
              placeholder="현재 비밀번호" 
              secureTextEntry 
              value={passwords.currentPassword}
              onChangeText={(text) => setPasswords({ ...passwords, currentPassword: text })}
              autoCapitalize="none"
              autoCorrect={false} />
            <TextInput 
              style={styles.input} 
              placeholder="새 비밀번호" 
              secureTextEntry
              value={passwords.newPassword} 
              onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })} 
              autoCapitalize="none"
              autoCorrect={false} />
            <TextInput style={styles.input} 
              placeholder="새 비밀번호 확인" 
              secureTextEntry 
              value={passwords.confirmPassword} 
              onChangeText={(text) => setPasswords({ ...passwords, confirmPassword: text })} 
              autoCapitalize="none"
              autoCorrect={false} />
            <CustomButton title="비밀번호 변경"
              onPress={handlePasswordChange} 
              style={styles.actionButton} />
          </View>
        </View>

        {/* 검사 이력 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>검사 이력</Text>
          <View style={styles.card}>
            <Text style={styles.historyLabel}>최근 검사 이력을 확인하세요!</Text>
            <Text style={styles.historyDescription}>검사 결과를 통해 위험을 예방하세요.</Text>
            <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
              <View style={styles.historyButtonContent}>
                <Text style={styles.historyButtonText}>검사 이력 보기</Text>
                <Icon name="search-outline" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.qrCodeText}>검사 이력 (최근 3개월)</Text>
              <Text style={styles.qrCodeText}>QR코드 / URL 검사 결과</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 회원 탈퇴 섹션 */}
        <TouchableOpacity onPress={handleWithdrawal} style={styles.withdrawalContainer}>
          <Text style={styles.withdrawalText}>회원 탈퇴</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 하단 네비게이션 바 */}
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
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#2D2D2D',
    fontFamily: 'Pretendard-SemiBold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    color: '#333333',
    fontFamily: 'Pretendard-Regular',
  },
  emergencyContactTitle: {
    fontSize: 14,
    color: '#2D2D2D',
    marginBottom: 4,
    fontFamily: 'Pretendard-Regular',
  },
  actionButton: {
    marginTop: 16,
    backgroundColor: '#4B8DF8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyButton: {
    backgroundColor: '#4B8DF8',
    borderRadius: 12,
    padding: 16,
  },
  historyButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
    marginRight: 8,
  },
  historyDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    fontFamily: 'Pretendard-Regular',
  },
  qrCodeText: {
    color: '#FFFFFF',
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
  },
  withdrawalContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  withdrawalText: {
    color: '#838383',
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
  },
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
});

export default MyPage;
