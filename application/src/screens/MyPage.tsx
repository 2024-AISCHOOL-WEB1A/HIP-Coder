import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/IJButton';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCsrf } from '../../context/CsrfContext';
import api from '../../axios';

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
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태
  const navigation = useNavigation();
  const { csrfToken } = useCsrf();

  // 사용자 데이터를 가져오는 함수
  const mypagelist = async () => {
    try {
      if (!csrfToken) {
        Alert.alert('오류', 'CSRF 토큰을 먼저 가져오세요.');
        return;
      }

      const res = await api.post(
        '/user/mypage',
        { idx: '1' },
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
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
        Alert.alert('서버 응답', '사용자 데이터를 불러왔습니다.');
      } else {
        console.error('잘못된 데이터 형식:', res.data);
        Alert.alert('오류', '서버로부터 잘못된 형식의 데이터가 반환되었습니다.');
      }
    } catch (error) {
      console.error('API 오류 발생:', error);
      Alert.alert('오류', '사용자 데이터를 가져오는 중 오류가 발생했습니다.');
    }
  };

  // 컴포넌트가 마운트될 때 사용자 데이터 불러오기
  useEffect(() => {
    mypagelist();
  }, []);

  const handleProfileUpdate = () => {
    if (isEditing) {
      // 프로필 수정 완료
      Alert.alert('알림', '프로필이 성공적으로 수정되었습니다.');
      setIsEditing(false); // 편집 모드 해제
    } else {
      // 편집 모드로 전환
      setIsEditing(true);
    }
  };

  const handlePasswordChange = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      Alert.alert('오류', '새 비밀번호가 일치하지 않습니다.');
      return;
    }
    Alert.alert('알림', '비밀번호가 성공적으로 변경되었습니다.');
  };

  const handleWithdrawal = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '탈퇴', style: 'destructive', onPress: () => navigation.navigate('LogoutPage') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 프로필 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>프로필 정보</Text>
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.fullInput, { backgroundColor: '#F0F0F0' }]}
                placeholder="이름"
                placeholderTextColor="#838383"
                value={profileData.name}
                onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                editable={false} // 항상 readonly
              />
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.fullInput, { backgroundColor: '#F0F0F0' }]}
                placeholder="핸드폰번호"
                placeholderTextColor="#838383"
                value={profileData.phone}
                onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                editable={false} // 항상 readonly
              />
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: '#F0F0F0' }]}
              placeholder="이메일"
              placeholderTextColor="#838383"
              value={profileData.email}
              onChangeText={(text) => setProfileData({ ...profileData, email: text })}
              editable={false} // 항상 readonly
            />
            <Text style={styles.emergencyContactTitle}>비상연락망(1)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isEditing ? '#FFFFFF' : '#F0F0F0' }]} // 비상 연락망 편집 가능
              placeholder="비상연락망(1)"
              placeholderTextColor="#838383"
              value={profileData.emergencyContact1}
              onChangeText={(text) => setProfileData({ ...profileData, emergencyContact1: text })}
              editable={isEditing} // 편집 모드일 때만 수정 가능
            />
            <Text style={styles.emergencyContactTitle}>비상연락망(2)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isEditing ? '#FFFFFF' : '#F0F0F0' }]} // 비상 연락망 편집 가능
              placeholder="비상연락망(2)"
              placeholderTextColor="#838383"
              value={profileData.emergencyContact2}
              onChangeText={(text) => setProfileData({ ...profileData, emergencyContact2: text })}
              editable={isEditing} // 편집 모드일 때만 수정 가능
            />
            <CustomButton
              title={isEditing ? "완료" : "프로필 수정"}
              onPress={handleProfileUpdate}
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* 비밀번호 변경 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>비밀번호 변경</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="현재 비밀번호"
              placeholderTextColor="#838383"
              secureTextEntry
              value={passwords.currentPassword}
              onChangeText={(text) => setPasswords({ ...passwords, currentPassword: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="새 비밀번호"
              placeholderTextColor="#838383"
              secureTextEntry
              value={passwords.newPassword}
              onChangeText={(text) => setPasswords({ ...passwords, newPassword: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="새 비밀번호 확인"
              placeholderTextColor="#838383"
              secureTextEntry
              value={passwords.confirmPassword}
              onChangeText={(text) => setPasswords({ ...passwords, confirmPassword: text })}
            />
            <CustomButton
              title="비밀번호 변경"
              onPress={handlePasswordChange}
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* 검사 이력 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>검사 이력</Text>
          <View style={styles.card}>
            <Text style={styles.historyLabel}>최근 검사 이력을 확인하세요!</Text>
            <Text style={styles.historyDescription}>검사 결과를 통해 위험을 예방하세요.</Text>
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => navigation.navigate('History')}
            >
              <View style={styles.historyButtonContent}>
                <Text style={styles.historyButtonText}>검사 이력 보기</Text>
                <Icon name="search-outline" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.historyDate}>2023-01-01 ~ 2023-11-01</Text>
              <Text style={styles.qrCodeText}>QR코드 / URL 검사 결과</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 회원 탈퇴 섹션 */}
        <TouchableOpacity onPress={handleWithdrawal}>
          <Text style={styles.withdrawalText}>회원 탈퇴</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 12,
    paddingHorizontal: 4,
    fontFamily: 'Pretendard-SemiBold', 
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fullInput: {
    width: '100%', // 넓이 100%로 설정
  },
  input: {
    height: 48,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontFamily: 'Pretendard-Regular',  
  },
  emergencyContactTitle: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
    fontFamily: 'Pretendard-Regular', 
  },
  actionButton: {
    marginTop: 8,
  },
  historyLabel: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Pretendard-Medium',  
  },
  historyDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    fontFamily: 'Pretendard-Regular',  
  },
  historyButton: {
    backgroundColor: '#9C59B5',
    borderRadius: 12,
    padding: 16,
  },
  historyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',  
  },
  historyDate: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',  
  },
  qrCodeText: {
    color: '#FFFFFF',
    marginTop: 4,
    fontSize: 14,
    fontFamily: 'Pretendard-Regular', 
  },
  withdrawalText: {
    alignSelf: 'center',
    marginTop: 32,
    paddingVertical: 8,
    color: '#838383',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',  
  },
});

export default MyPage;
