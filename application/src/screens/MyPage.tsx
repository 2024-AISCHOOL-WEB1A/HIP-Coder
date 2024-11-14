import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../components/IJButton';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCsrf } from '../../context/CsrfContext';
import api from '../../axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyPage = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    email: '',
    emergencyContact1: '',
    emergencyContact2: '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { csrfToken } = useCsrf();

  const mypagelist = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('오류', '로그인이 필요합니다. 로그인 페이지로 이동합니다.', [
          { text: '확인', onPress: () => navigation.navigate('Login') },
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
          phone: userData.PHONE,
          email: userData.EMAIL,
          emergencyContact1: userData.CONTACT_INFO1 || '',
          emergencyContact2: userData.CONTACT_INFO2 || '',
        });
      } else {
        console.error('잘못된 데이터 형식:', res.data);
        Alert.alert('오류', '서버로부터 잘못된 형식의 데이터가 반환되었습니다.');
      }
    } catch (error) {
      console.error('API 오류 발생:', error);
      Alert.alert('오류', '사용자 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  };

  const handlePasswordChange = async () => {
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

  useEffect(() => {
    mypagelist();
  }, []);

  const handleProfileUpdate = async () => {
    if (isEditing) {
      Alert.alert('알림', '프로필이 성공적으로 수정되었습니다.');
      setIsEditing(false);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('오류', '로그인이 필요합니다. 로그인 페이지로 이동합니다.', [
            { text: '확인', onPress: () => navigation.navigate('Login') },
          ]);
          return;
        }

        const response = await api.post(
          '/user/update',
          {
            emergencyContact1: profileData.emergencyContact1,
            emergencyContact2: profileData.emergencyContact2,
          },
          { headers: { 'X-CSRF-Token': csrfToken, 'Authorization': `Bearer ${token}` }, withCredentials: true }
        );

        if (response.status === 200) {
          Alert.alert('알림', '프로필이 성공적으로 수정되었습니다.');
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

  const getIconColor = (screen) => {
    return route.name === screen ? '#3182f6' : '#9DA3B4';
  };

  return (
    <View style={styles.container}>
      <Header title="내정보" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>프로필 정보</Text>
          <View style={styles.card}>
            <TextInput style={[styles.input, styles.fullInput, { backgroundColor: '#F0F0F0' }]} placeholder="이름" value={profileData.name} editable={false} />
            <TextInput style={[styles.input, styles.fullInput, { backgroundColor: '#F0F0F0' }]} placeholder="핸드폰번호" value={profileData.phone} editable={false} />
            <TextInput style={[styles.input, { backgroundColor: '#F0F0F0' }]} placeholder="이메일" value={profileData.email} editable={false} />
            <Text style={styles.emergencyContactTitle}>비상연락망(1)</Text>
            <TextInput style={[styles.input, { backgroundColor: isEditing ? '#FFFFFF' : '#F0F0F0' }]} placeholder="비상연락망(1)" value={profileData.emergencyContact1} onChangeText={(text) => setProfileData({ ...profileData, emergencyContact1: text })} editable={isEditing} />
            <Text style={styles.emergencyContactTitle}>비상연락망(2)</Text>
            <TextInput style={[styles.input, { backgroundColor: isEditing ? '#FFFFFF' : '#F0F0F0' }]} placeholder="비상연락망(2)" value={profileData.emergencyContact2} onChangeText={(text) => setProfileData({ ...profileData, emergencyContact2: text })} editable={isEditing} />
            <CustomButton title={isEditing ? "완료" : "프로필 수정"} onPress={handleProfileUpdate} style={styles.actionButton} />
          </View>
        </View>

        {/* 비밀번호 변경 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>비밀번호 변경</Text>
          <View style={styles.card}>
            <TextInput style={styles.input} placeholder="현재 비밀번호" secureTextEntry value={passwords.currentPassword} onChangeText={(text) => setPasswords({ ...passwords, currentPassword: text })} />
            <TextInput style={styles.input} placeholder="새 비밀번호" secureTextEntry value={passwords.newPassword} onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })} />
            <TextInput style={styles.input} placeholder="새 비밀번호 확인" secureTextEntry value={passwords.confirmPassword} onChangeText={(text) => setPasswords({ ...passwords, confirmPassword: text })} />
            <CustomButton title="비밀번호 변경" onPress={handlePasswordChange} style={styles.actionButton} />
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
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color={getIconColor('Home')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('History')}>
          <Icon name="time-outline" size={24} color={getIconColor('History')} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MyPage')}>
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14, 
  },
  fullInput: {
    width: '100%',
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  navButton: {
    alignItems: 'center',
  }, 
});

export default MyPage;
