import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const Home = () => {
  const navigation = useNavigation();
  const isLoggedIn = false; // 실제 로그인 상태 확인 로직으로 교체
  const handleLogout = () => {
    // 로그아웃 로직 작성
  };

  return (
    <View style={styles.container}>
      {/* Header 컴포넌트 */}
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
      />

      {/* Header 아래 제목 */}
      <Text style={styles.mainTitle}>Thing Q</Text>

      {/* URL 검사 검색 바 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="URL 입력"
          placeholderTextColor="#838383"
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate('UrlCheck')}>
          <Icon name="search-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 카테고리 버튼 섹션 */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('QrScan')}>
          <Icon name="qr-code-outline" size={24} color="#FFFFFF" />
          <Text style={styles.categoryText}>QR 코드 검사</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('MyPage')}>
          <Icon name="document-text-outline" size={24} color="#FFFFFF" />
          <Text style={styles.categoryText}>내 정보</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('Join')}>
          <Icon name="person-add-outline" size={24} color="#FFFFFF" />
          <Text style={styles.categoryText}>회원가입</Text>
        </TouchableOpacity>
      </View>

      {/* Browse 섹션 */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.browseTitle}>Browse</Text>
        
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('QrScan')}>
            <Image 
              source={require('../assets/qr-code-scan.png')} // 이미지 경로 수정
              style={styles.cardImage} 
            />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>QR 코드 검사</Text>
              <Text style={styles.cardDescription}>QR 코드를 스캔하여 검사하세요.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UrlCheck')}>
            <Text style={styles.cardTitle}>URL 검사</Text>
            <Text style={styles.cardDescription}>URL을 입력하여 검사하세요.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 테스트 버튼 */}
      <TouchableOpacity style={styles.testButton} onPress={() => navigation.navigate('Test')}>
        <Text style={styles.testButtonText}>테스트 지우지마세요!</Text>
      </TouchableOpacity>

      {/* 하단 네비게이션 바 */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="home-outline" size={24} color="#9C59B5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Login')}>
          <Icon name="time-outline" size={24} color="#838383" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MyPage')}>
          <Icon name="person-outline" size={24} color="#838383" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  searchButton: {
    backgroundColor: '#9C59B5',
    padding: 10,
    borderRadius: 25,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: '#9C59B5',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    width: '30%',
  },
  categoryText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  browseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#E0F7FA', 
    padding: 20,
    borderRadius: 15,
    width: '100%', 
    marginBottom: 15,
    flexDirection: 'row', // 가로 방향으로 정렬
    alignItems: 'center', // 세로 중앙 정렬
  },
  cardImage: {
    width: 100, // 이미지 크기 조정
    height: 100, // 이미지 크기 조정
    marginRight: 15, // 이미지와 텍스트 간의 간격
  },
  cardTextContainer: {
    flex: 1, // 텍스트가 공간을 채우도록 설정
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#838383',
  },
  testButton: {
    backgroundColor: '#9C59B5',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#F0F0F0',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  navButton: {
    padding: 10,
  },
});

export default Home;
