import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/IJButton';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';

const MyPage = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact1, setEmergencyContact1] = useState('');
  const [emergencyContact2, setEmergencyContact2] = useState('');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>나의 정보 수정</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="이름"
            placeholderTextColor="#838383"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="생년월일"
            placeholderTextColor="#838383"
            value={birthdate}
            onChangeText={setBirthdate}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="핸드폰번호"
          placeholderTextColor="#838383"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="비상연락망(1)"
          placeholderTextColor="#838383"
          value={emergencyContact1}
          onChangeText={setEmergencyContact1}
        />
        <TextInput
          style={styles.input}
          placeholder="비상연락망(2)"
          placeholderTextColor="#838383"
          value={emergencyContact2}
          onChangeText={setEmergencyContact2}
        />

        <View style={styles.buttonContainer}>
          <CustomButton title="수정하기" onPress={() => { /* 수정 로직 */ }} />
        </View>

        {/* 회원탈퇴 버튼 추가 */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('LogoutPage')}>
          <Text style={styles.logoutButtonText}>회원탈퇴</Text>
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.title}>검사 이력 확인</Text>
        </View>

        <View style={styles.separator} />

        {/* 왼쪽 정렬 텍스트 */}
        <View style={styles.historySection}>
          <Text style={styles.historyLabel}>최근 검사 이력을 확인하세요!</Text>
          <Text style={styles.historyDescription}>
            검사 결과를 통해 위험을 예방하세요.
          </Text>
        </View>

        {/* 버튼 디자인 수정 */}
        <View style={styles.centeredSection}>
          <TouchableOpacity style={styles.historyButton}>
            <Text style={styles.historyButtonText}>검사 이력 보기</Text>
            <Icon name="search-outline" size={24} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.historyDate}>2024-07-10 ~ 2025-07-10</Text>
            <Text style={styles.qrCodeText}>QR코드 / URL 검사 결과</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 20,
    paddingRight: 20,
  },
  scrollContainer: {
    padding: 20,
    width: '100%',
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    paddingTop: 40,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#B490CA',
    marginVertical: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#B490CA',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  historySection: {
    alignItems: 'flex-start', // 왼쪽 정렬
    marginVertical: 10,
  },
  historyLabel: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },
  historyDescription: {
    fontSize: 14,
    color: '#838383',
    textAlign: 'left', // 왼쪽 정렬
  },
  centeredSection: {
    alignItems: 'center', // 가운데 정렬
    marginVertical: 20,
  },
  historyButton: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#9C59B5',
    paddingVertical: 20,
    paddingHorizontal: 30,
    width: '100%',
    borderRadius: 25,
    marginBottom: 10,
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  icon: {
    marginLeft: 5,
  },
  logoutButton: {
    alignItems: 'flex-end', // 오른쪽 정렬
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#838383',
  },
  historyDate: {
    color: '#FFFFFF',
    marginTop: 5,
  },
  qrCodeText: {
    color: '#FFFFFF',
    textAlign: 'left', // 왼쪽 정렬
    marginTop: 5,
  },
});

export default MyPage;
