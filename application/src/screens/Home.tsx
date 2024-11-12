import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import AnimateNumber from 'react-native-animate-number';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../axios';
import { useCsrf } from '../../context/CsrfContext';

const Home: React.FC = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [urlCount, setUrlCount] = useState<number>(0);
  const [qrCount, setQrCount] = useState<number>(0);
  const { csrfToken } = useCsrf();

  // 로그인 상태 확인 (토큰)
  const checkIsLogin = async () => {

    const accessToken = await AsyncStorage.getItem('accessToken')
    setIsLoggedIn(!!accessToken)
  }


  // 렌더링 시 로그인 상태 확인 및 카운트 데이터 가져오기
  useEffect(() => {
    checkIsLogin();
    getCounts();  // 페이지 렌더링 시 카운트 값을 가져오는 함수 호출
  }, []);

  // Home 화면이 다시 포커스될 때 로그인 상태 확인
  useFocusEffect(
    React.useCallback(() => {
      checkIsLogin();
    }, [])
  );

  // /scan/counting API 호출하여 urlCount 및 qrCount 값을 가져오는 함수
  const getCounts = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await api.get('/scan/counting', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,  // JWT 토큰 추가
          'X-CSRF-Token': csrfToken            // CSRF 토큰 추가
        },
        withCredentials: true                  // 쿠키 사용을 위한 설정
      });
      if (response.data) {
        setUrlCount(response.data.total_url_count || 0);
        setQrCount(response.data.total_qr_count || 0);
      }
    } catch (error: any) {
      console.error('카운트 데이터를 가져오는 중 오류 발생:', error);
      if (error.response && error.response.status === 403) {
        Alert.alert('오류', '권한이 없습니다. 로그인이 필요합니다.');
        navigation.navigate('Login' as never); // 'Login'을 'never'로 캐스팅하여 TypeScript 오류 방지
      } else {
        Alert.alert('오류', '카운트 데이터를 가져오는 데 실패했습니다.');
      }
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleLogout = async () => {
    // 로그인 상태, 인풋창 초기화
    setIsLoggedIn(false);

    // AsyncStorage에서 JWT 토큰 삭제
    await AsyncStorage.removeItem('accessToken');
    // Axios 헤더 JWT 토큰 삭제
    api.defaults.headers.Authorization = null;

    // AsyncStorage에서 토큰 삭제 확인

    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('AsyncStorage에서 JWT 토큰이 정상 삭제되었습니다.');
    } else {
      console.error('AsyncStorage에서 JWT 토큰 삭제 실패:', accessToken);
    }
    // Axios 헤더에서 토큰 삭제 확인
    if (!api.defaults.headers.Authorization) {
      console.log('Axios Authorization 헤더에서 JWT 토큰이 정상 삭제되었습니다.');
    } else {
      console.error('Axios Authorization 헤더에서 JWT 토큰 삭제 실패:', api.defaults.headers.Authorization);
    }
  };

  const getIconColor = (screen) => {
    return navigation.isFocused(screen) ? '#3182f6' : '#9DA3B4';
  };

  return (
    <View style={styles.container}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainTitleContainer}>
          <Image
            source={require('../assets/images/ThingQFulllogo.png')}
            style={styles.mainTitleImage}
          />
        </View>

        <View style={styles.counterContainer}>
          <View style={styles.counterBox}>
            <Text style={styles.counterTitle}>악성 URL 탐지</Text>
            <View style={styles.counterValueContainer}>
              <AnimateNumber
                value={urlCount}
                formatter={(val) => Math.floor(val).toString()}
                timing="easeOut"
                steps={30}
                interval={16}
                style={styles.counterValue}
              />
              <Text style={styles.counterUnit}>건</Text>
            </View>
          </View>

          <View style={styles.counterBox}>
            <Text style={styles.counterTitle}>QR 코드 검사</Text>
            <View style={styles.counterValueContainer}>
              <AnimateNumber
                value={qrCount}
                formatter={(val) => Math.floor(val).toString()}
                timing="easeOut"
                steps={30}
                interval={16}
                style={styles.counterValue}
              />
              <Text style={styles.counterUnit}>건</Text>
            </View>
          </View>
        </View>

        <View style={styles.categoryContainer}>
          <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate('Report' as never)}>
            <View style={styles.categoryIconContainer}>
              <Icon name="notifications-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>신고하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryButton} onPress={() => navigation.navigate(isLoggedIn ? 'MyPage' as never : 'Join' as never)}>
            <View style={styles.categoryIconContainer}>
              <Icon name={isLoggedIn ? "document-text-outline" : "person-add-outline"} size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>{isLoggedIn ? '내 정보' : '회원가입'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryButton}
            onPress={isLoggedIn ? handleLogout : handleLogin}
            activeOpacity={0.7}
          >
            <View style={styles.categoryIconContainer}>
              <Icon name={isLoggedIn ? "log-out-outline" : "log-in-outline"} size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>{isLoggedIn ? "로그아웃" : "로그인"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.CodeCheckerSection}>
          <Text style={styles.CodeCheckerTitle}>큐싱 검사</Text>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('QrScan' as never)}>
            <View style={styles.cardIconContainer}>
              <Image
                source={require('../assets/free-icon-scan.png')}
                style={styles.iconImage}
              />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>QR 코드 검사</Text>
              <Text style={styles.cardDescription}>QR 코드를 스캔하여 안전하게 검사하세요!</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UrlCheck' as never)}>
            <View style={styles.cardIconContainer}>
              <Image
                source={require('../assets/free-icon-url.png')}
                style={styles.iconImage}
              />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>URL 검사</Text>
              <Text style={styles.cardDescription}>URL을 입력하여 안전하게 검사하세요!</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('GalleryQrScan' as never)}>
            <View style={styles.cardIconContainer}>
              <Image
                source={require('../assets/free-icon-gallery.png')}
                style={styles.iconImage}
              />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>QR 이미지 검사</Text>
              <Text style={styles.cardDescription}>갤러리에서 QR 코드를 선택하여 안전하게 {'\n'}검사하세요!</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity
          style={styles.testButton}
          onPress={() => navigation.navigate('Test' as never)}
        >
          <Text style={styles.testButtonText}>테스트 지우지마세요!</Text>
        </TouchableOpacity> */}
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="home" size={24} color={getIconColor('Home')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('History' as never)}
        >
          <Icon name="time-outline" size={24} color="#9DA3B4" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('MyPage' as never)}
        >
          <Icon name="person-outline" size={24} color="#9DA3B4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainTitleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  mainTitleImage: {
    width: 150,
    height: 30, 
    resizeMode: 'contain', 
    top: -10,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
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
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#4A4A4A',
    marginBottom: 8,
  },
  counterValue: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    color: '#4A4A4A',
  },
  counterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterUnit: {
    fontSize: 18,
    fontFamily: 'Pretendard-Bold',
    color: '#4A4A4A',
    marginLeft: 4,
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
    width: 64,
    height: 64,
    backgroundColor: '#4593fc',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
    color: '#000',
    textAlign: 'center',
  },
  CodeCheckerSection: {
    marginBottom: 24,
  },
  CodeCheckerTitle: {
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
    color: '#1A1D1E',
    paddingLeft: 16,
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
    fontFamily: 'Pretendard-Bold',
    color: '#1A1D1E',
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    color: '#6D6D6D',
  },
  iconImage: {
    width: 60,
    height: 60,
  },
  testButton: {
    backgroundColor: '#3182f6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  testButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
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

export default Home;
