import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/IJButton';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

interface UserData {
  USER_NAME: string;
  PHONE: string;
  EMAIL: string;
  CONTACT_INFO: string[];
}

const MyPage = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const navigation = useNavigation();
  const csrfToken = ''; // CSRF 토큰을 여기에 설정하세요.

  // 사용자 데이터를 가져오는 함수
  const mypagelist = async () => {
    try {
      if (!csrfToken) {
        Alert.alert('오류', 'CSRF 토큰을 먼저 가져오세요.');
        return;
      }

      const res = await axios.post(
        'http://your-api-url/user/mypage', 
        { idx: '1' }, // 사용자 인덱스
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      );

      // 서버에서 받은 데이터를 'message' 키를 통해 접근 및 가공
      if (res.data && Array.isArray(res.data.message)) {
        const processedData: UserData[] = res.data.message.map((item: any) => ({
          USER_NAME: item.USER_NAME,
          PHONE: item.PHONE,
          EMAIL: item.EMAIL,
          CONTACT_INFO: [item.CONTACT_INFO1, item.CONTACT_INFO2].filter(Boolean),
        }));

        setUserData(processedData);
        Alert.alert('서버 응답', '사용자 데이터를 불러왔습니다.');
      } else {
        console.error('잘못된 데이터 형식:', res.data);
        Alert.alert('오류', '서버로부터 잘못된 형식의 데이터가 반환되었습니다.');
      }
    } catch (error: unknown) {
      handleApiError(error);
    }
  };

  // API 오류 처리 함수
  const handleApiError = (error: unknown) => {
    console.error('API 오류 발생:', error);
    Alert.alert('오류', '사용자 데이터를 가져오는 중 오류가 발생했습니다.');
  };

  // 컴포넌트가 마운트될 때 사용자 데이터 불러오기
  useEffect(() => {
    mypagelist();
  }, []);

  const handleProfileUpdate = () => {
    Alert.alert('알림', '프로필이 성공적으로 수정되었습니다.');
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
            <TextInput
              style={[styles.input, styles.fullInput]}
              placeholder="이름"
              placeholderTextColor="#838383"
              value={userData[0]?.USER_NAME} // 첫 번째 사용자 데이터의 이름
              onChangeText={(text) => setUserData([{ ...userData[0], USER_NAME: text }])}
            />
            <TextInput
              style={[styles.input, styles.fullInput]}
              placeholder="핸드폰번호"
              placeholderTextColor="#838383"
              value={userData[0]?.PHONE} // 첫 번째 사용자 데이터의 전화번호
              onChangeText={(text) => setUserData([{ ...userData[0], PHONE: text }])}
            />
            <TextInput
              style={styles.input}
              placeholder="이메일"
              placeholderTextColor="#838383"
              value={userData[0]?.EMAIL} // 첫 번째 사용자 데이터의 이메일
              onChangeText={(text) => setUserData([{ ...userData[0], EMAIL: text }])}
            />
            <TextInput
              style={styles.input}
              placeholder="비상연락망(1)"
              placeholderTextColor="#838383"
              value={userData[0]?.CONTACT_INFO[0]} // 첫 번째 비상연락망
              onChangeText={(text) => setUserData([{ ...userData[0], CONTACT_INFO: [text, userData[0]?.CONTACT_INFO[1]] }])}
            />
            <TextInput
              style={styles.input}
              placeholder="비상연락망(2)"
              placeholderTextColor="#838383"
              value={userData[0]?.CONTACT_INFO[1]} // 두 번째 비상연락망
              onChangeText={(text) => setUserData([{ ...userData[0], CONTACT_INFO: [userData[0]?.CONTACT_INFO[0], text] }])}
            />
            <CustomButton 
              title="프로필 수정" 
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
        <TouchableOpacity 
          style={styles.withdrawalButton} 
          onPress={handleWithdrawal}
        >
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
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    paddingHorizontal: 4,
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  fullInput: {
    width: '100%',
  },
  actionButton: {
    marginTop: 12,
  },
  historyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  historyDescription: {
    fontSize: 14,
    color: '#666666',
  },
  historyButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  historyDate: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  qrCodeText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  withdrawalButton: {
    backgroundColor: '#FF6347',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  withdrawalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyPage;
