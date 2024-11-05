import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import AnimateNumber from 'react-native-animate-number';

const Home = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [urlCount, setUrlCount] = useState(100);
  const [qrCount, setQrCount] = useState(50000);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    navigation.navigate('Login');
    setIsLoggedIn(true);
  };

  const incrementUrlCount = () => {
    setUrlCount((prevCount) => prevCount + 1);
  };

  const incrementQrCount = () => {
    setQrCount((prevCount) => prevCount + 1);
  };

  return (
    <View style={styles.container}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Thing Q</Text>

        <View style={styles.counterContainer}>
          <View style={styles.counterBox}>
            <Text style={styles.counterTitle}>차단된 URL 수</Text>
            <AnimateNumber 
              value={urlCount}
              formatter={(val) => Math.floor(val).toString()}
              timing="easeOut"
              steps={30}
              interval={16}
              style={styles.counterValue}
            />
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.counterTitle}>QR 코드 검사 수</Text>
            <AnimateNumber 
              value={qrCount}
              formatter={(val) => Math.floor(val).toString()}
              timing="easeOut"
              steps={30}
              interval={16}
              style={styles.counterValue}
            />
          </View>
        </View>

        <View style={styles.categoryContainer}>
          <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('Report')}>
            <View style={styles.categoryIconContainer}>
              <Icon name="notifications-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>신고하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('MyPage')}>
            <View style={styles.categoryIconContainer}>
              <Icon name="document-text-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>내 정보</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryButton}
            onPress={isLoggedIn ? handleLogout : handleLogin}
          >
            <View style={styles.categoryIconContainer}>
              <Icon name={isLoggedIn ? "log-out-outline" : "log-in-outline"} size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>{isLoggedIn ? "로그아웃" : "로그인"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.CodeCheckerSection}>
          <Text style={styles.CodeCheckerTitle}>큐싱 검사</Text>

          <TouchableOpacity style={styles.card} onPress={() => { incrementQrCount(); navigation.navigate('QrScan'); }}>
            <View style={styles.cardIconContainer}>
              <Icon name="qr-code" size={32} color="#9C59B5" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>QR 코드 검사</Text>
              <Text style={styles.cardDescription}>QR 코드를 스캔하여 안전하게 검사하세요!</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => { incrementUrlCount(); navigation.navigate('UrlCheck'); }}>
            <View style={styles.cardIconContainer}>
              <Icon name="link" size={32} color="#9C59B5" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>URL 검사</Text>
              <Text style={styles.cardDescription}>URL을 입력하여 안전하게 검사하세요!</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('GalleryQrScan')}>
            <View style={styles.cardIconContainer}>
              <Icon name="image-outline" size={32} color="#9C59B5" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>QR 이미지 검사</Text>
              <Text style={styles.cardDescription}>갤러리에서 QR 코드를 선택하여 안전하게 {'\n'}검사하세요!</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.testButton}
          onPress={() => navigation.navigate('Test')}
        >
          <Text style={styles.testButtonText}>테스트 지우지마세요!</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="home" size={24} color="#9C59B5" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('History')}
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
    backgroundColor: '#E6E6FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1D1E',
    textAlign: 'center',
    marginVertical: 20,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  counterBox: {
    alignItems: 'center',
  },
  counterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 8,
  },
  counterValue: {
    fontSize: 22, 
    fontWeight: '700',
    color: '#4A4A4A',
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
    backgroundColor: '#9C59B5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000', // 텍스트 색상 변경
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#F0E5F5', // 아이콘 배경 색상
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1D1E',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  testButton: {
    backgroundColor: '#9C59B5', // 버튼 색상
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
