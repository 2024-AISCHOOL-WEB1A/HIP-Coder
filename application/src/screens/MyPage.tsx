import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';

const MyPage = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header onBackPress={() => navigation.goBack()}>
      </Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>나의 정보 수정</Text>
        </View>

        <View style={styles.separator} />

        <TextInput
          style={styles.input}
          placeholder="이름"
          placeholderTextColor="#838383"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="생년월일"
          placeholderTextColor="#838383"
          value={birthdate}
          onChangeText={setBirthdate}
        />
        <TextInput
          style={styles.input}
          placeholder="핸드폰번호"
          placeholderTextColor="#838383"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.genderLabel}>성별</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[styles.genderButton, gender === '남자' && styles.activeGender]}
            onPress={() => setGender('남자')}
          >
            <Text style={styles.genderButtonText}>남자</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === '여자' && styles.activeGender]}
            onPress={() => setGender('여자')}
          >
            <Text style={styles.genderButtonText}>여자</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton title="회원탈퇴" onPress={() => { /* 회원탈퇴 로직 */ }} />
        </View>

        <View style={styles.historySection}>
          <Text style={styles.historyLabel}>최근 검사 이력을 확인하세요!</Text>
          <Text style={styles.historyDescription}>
            검사 결과를 통해 위협을 예방하세요.
          </Text>

          <TouchableOpacity style={styles.historyButton}>
            <Text style={styles.historyButtonText}>검사 이력 보기</Text>
            <Icon name="search-outline" size={24} color="#FFFFFF" style={styles.icon} />
          </TouchableOpacity>

          <Text style={styles.historyDate}>2024-07-10 ~ 2025-07-10</Text>
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
    padding: 20,
    width: '100%',
  },
  textContainer: {
    alignItems: 'center',
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
  genderLabel: {
    fontSize: 16,
    marginVertical: 10,
    color: '#000000',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#B490CA',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
  },
  activeGender: {
    backgroundColor: '#D1C4E9',
  },
  genderButtonText: {
    color: '#000000',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  historySection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  historyLabel: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },
  historyDescription: {
    fontSize: 14,
    color: '#838383',
    textAlign: 'center',
    marginBottom: 10,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A1B9A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  historyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 10,
  },
  icon: {
    marginLeft: 5,
  },
  historyDate: {
    color: '#838383',
    marginTop: 10,
  },
});

export default MyPage;
