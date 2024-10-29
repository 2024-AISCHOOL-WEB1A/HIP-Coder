import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import UrlCheck from './UrlCheck'; // UrlCheck 컴포넌트를 임포트

const Home = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [url, setUrl] = useState(''); // URL 상태 추가

  const handleLogout = () => {
    setIsLoggedIn(false); // 로그아웃
  };

  const handleLogin = () => {
    navigation.navigate('Login'); // 로그인 화면으로 이동
    setIsLoggedIn(true); // 로그인 상태 업데이트 (실제로는 로그인 성공 후에 호출해야 함)
  };

  const checkUrlSafety = (urlToCheck) => {
    // URL 검사 로직을 여기에 구현
    Alert.alert(`검사 중인 URL: ${urlToCheck}`);
  };

  const handleSearch = () => {
    if (url) {
      checkUrlSafety(url); // URL 검사 함수 호출
    } else {
      Alert.alert("URL을 입력하세요!"); // URL이 비어있을 경우 알림
    }
  };

  return (
    <View style={styles.container}>
      {/* Header 컴포넌트 */}
      <Header 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout} 
      />

      {/* 메인 컨텐츠 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header 아래 제목 */}
        <Text style={styles.mainTitle}>Thing Q</Text>

        {/* URL 검사 검색 바 */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="URL을 입력하세요"
            placeholderTextColor="#9DA3B4"
            value={url} // URL 상태를 텍스트 입력에 연결
            onChangeText={setUrl} // URL 상태 업데이트
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch} // URL 검색 함수 호출
          >
            <Icon name="search-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 카테고리 버튼 섹션 */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity 
            style={styles.categoryButton} 
            onPress={() => navigation.navigate('Report')}
          >
            <View style={styles.categoryIconContainer}>
              <Icon name="notifications-outline" size={24} color="#9C59B5" />
            </View>
            <Text style={styles.categoryText}>신고하기</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.categoryButton} 
            onPress={() => navigation.navigate('MyPage')}
          >
            <View style={styles.categoryIconContainer}>
              <Icon name="document-text-outline" size={24} color="#9C59B5" />
            </View>
            <Text style={styles.categoryText}>내 정보</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.categoryButton} 
            onPress={isLoggedIn ? handleLogout : handleLogin} // 로그인 상태에 따라 로그아웃/로그인
          >
            <View style={styles.categoryIconContainer}>
              <Icon name={isLoggedIn ? "log-out-outline" : "log-in-outline"} size={24} color="#9C59B5" /> 
            </View>
            <Text style={styles.categoryText}>{isLoggedIn ? "로그아웃" : "로그인"}</Text>
          </TouchableOpacity>
        </View>

        {/* Code Checker 섹션 */}
        <View style={styles.CodeCheckerSection}>
          <Text style={styles.CodeCheckerTitle}>큐싱 검사</Text>
          
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('QrScan')}
          >
            <View style={styles.cardIconContainer}>
              <Icon name="qr-code" size={32} color="#9C59B5" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>QR 코드 검사</Text>
              <Text style={styles.cardDescription}>
                QR 코드를 스캔하여 안전하게 검사하세요 !
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('UrlCheck')}
          >
            <View style={styles.cardIconContainer}>
              <Icon name="link" size={32} color="#9C59B5" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>URL 검사</Text>
              <Text style={styles.cardDescription}>
                URL을 입력하여 안전하게 검사하세요 !
              </Text>
            </View>
          </TouchableOpacity>

          {/* 갤러리에서 QR 코드 검사 버튼 추가 */}
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('GalleryQrScan')} 
          >
            <View style={styles.cardIconContainer}>
              <Icon name="image-outline" size={32} color="#9C59B5" /> 
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>QR 코드 이미지 검사</Text>
              <Text style={styles.cardDescription}>
                갤러리에서 QR 코드를 선택하여 안전하게{"\n"}검사하세요 !
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 테스트 버튼 */}
        <TouchableOpacity 
          style={styles.testButton} 
          onPress={() => navigation.navigate('Test')}
        >
          <Text style={styles.testButtonText}>테스트 지우지마세요!</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 하단 네비게이션 바 */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="home" size={24} color="#9C59B5" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('History')} // 검사 이력 보기 페이지로 이동
        >
          <Icon name="time-outline" size={24} color="#9DA3B4" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate('MyPage')}
        >
          <Icon name="person-outline" size={24} color="#9DA3B4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1D1E',
    textAlign: 'center',
    marginVertical: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1D1E',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchButton: {
    backgroundColor: '#9C59B5',
    padding: 12,
    borderRadius: 12,
    marginRight: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  categoryButton: {
    alignItems: 'center',
    width: '30%',
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#F0E5F5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1D1E',
    textAlign: 'center',
  },
  CodeCheckerSection: {
    marginBottom: 24,
  },
  CodeCheckerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1D1E',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#F0E5F5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1D1E',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  testButton: {
    backgroundColor: '#9C59B5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
  },
});

export default Home;
