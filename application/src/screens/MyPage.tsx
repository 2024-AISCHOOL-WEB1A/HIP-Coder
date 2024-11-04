import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/IJButton';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';

const MyPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyContact1, setEmergencyContact1] = useState('');
  const [emergencyContact2, setEmergencyContact2] = useState('');
  const navigation = useNavigation();

  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return {
      start: startDate.toLocaleDateString('ko-KR', options),
      end: endDate.toLocaleDateString('ko-KR', options),
    };
  };

  const { start, end } = getDateRange();

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
            placeholder="핸드폰번호"
            placeholderTextColor="#838383"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          placeholderTextColor="#838383"
          value={email}
          onChangeText={setEmail}
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
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('LogoutPage')}>
          <Text style={styles.logoutButtonText}>회원탈퇴</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.title}>검사 이력 확인</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.historySection}>
          <Text style={styles.historyLabel}>최근 검사 이력을 확인하세요!</Text>
          <Text style={styles.historyDescription}>
            검사 결과를 통해 위험을 예방하세요.
          </Text>
        </View>
        <View style={styles.centeredSection}>
          <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
            <View style={styles.historyButtonContent}>
              <Text style={styles.historyButtonText}>검사 이력 보기</Text>
              <Icon name="search-outline" size={24} color="#FFFFFF" style={styles.icon} />
            </View>
            <Text style={styles.historyDate}>{start} ~ {end}</Text>
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
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 40,
    width: '100%',
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    paddingTop: 20,
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
    alignItems: 'flex-start',
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
    textAlign: 'left',
  },
  centeredSection: {
    alignItems: 'center',
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
    marginBottom: 5,
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  historyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  icon: {
    marginLeft: 5,
  },
  logoutButton: {
    alignItems: 'flex-end',
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
    textAlign: 'left',
    marginTop: 5,
  },
});

export default MyPage;
