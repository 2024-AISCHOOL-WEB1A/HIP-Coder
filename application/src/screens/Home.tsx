import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import AnimateNumber from 'react-native-animate-number';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../axios';
import { useCsrf } from '../../context/CsrfContext';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

const Home: React.FC = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [urlCount, setUrlCount] = useState<number>(0);
  const [qrCount, setQrCount] = useState<number>(0);
  const { csrfToken } = useCsrf();

  // 로그인 상태 확인 (토큰)
  const checkIsLogin = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken);
  };

  // 렌더링 시 로그인 상태 확인 및 카운트 데이터 가져오기
  useEffect(() => {
    checkIsLogin();
    getCounts(); // 페이지 렌더링 시 카운트 값을 가져오는 함수 호출
  }, []);

  // Home 화면이 다시 포커스될 때 로그인 상태 및 카운트 데이터를 다시 확인
  useFocusEffect(
    React.useCallback(() => {
      checkIsLogin();
      getCounts(); // 페이지 포커스 시 카운트 값을 다시 가져오기
    }, [])
  );
  // 카운트 데이터를 다시 가져오는 함수 수정
  const getCounts = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await api.get('/scan/counting', {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // JWT 토큰 추가
          'X-CSRF-Token': csrfToken                 // CSRF 토큰 추가
        },
        withCredentials: true                        // 쿠키 사용을 위한 설정
      });
      if (response.data) {
        // 애니메이션이 재실행되도록 null로 상태 초기화 후 설정
        setUrlCount(null);
        setQrCount(null);
        setTimeout(() => {
          setUrlCount(response.data.total_url_count || 0);
          setQrCount(response.data.total_qr_count || 0);
        }, 0);
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
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('accessToken');
    api.defaults.headers.Authorization = null;
    
    // 로그아웃 완료 후 알림 메시지 표시
    Alert.alert(
      "로그아웃 완료",
      "로그아웃이 완료되었습니다.",
      [{ text: "확인" }]
    );
  };

  // Home.tsx에서 handleGalleryQrScanNavigation 함수 수정
  const handleGalleryQrScanNavigation = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('이미지 선택이 취소되었습니다.');
        // 이미지 선택이 취소되었을 때 페이지 이동 없이 함수 종료
        return;
      } else if (response.errorMessage) {
        console.log('에러: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          console.log('선택한 이미지 URI:', uri);
          // 이미지를 성공적으로 선택했을 때 GalleryQrScan 페이지로 이동, 선택한 이미지 URI를 함께 전달
          navigation.navigate('GalleryQrScan' as never, { imageUri: uri } as never);
        }
      }
    });
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
                key={urlCount}  // key prop 추가
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
                key={qrCount}  // key prop 추가
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

          <TouchableOpacity style={styles.card} onPress={handleGalleryQrScanNavigation}>
            <View style={styles.cardIconContainer}>
              <Image source={require('../assets/free-icon-gallery.png')} style={styles.iconImage} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>QR 이미지 검사</Text>
              <Text style={styles.cardDescription}>갤러리에서 QR 코드를 선택하여 안전하게 {'\n'}검사하세요!</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.testButton}
          onPress={() => navigation.navigate('Test' as never)}
        >
          <Text style={styles.testButtonText}>테스트 지우지마세요!</Text>
        </TouchableOpacity>
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

// 스타일 정의는 동일
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
