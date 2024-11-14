import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../axios';
import { useCsrf } from '../../context/CsrfContext';

const ITEMS_PER_PAGE = 5;

const History = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const { csrfToken } = useCsrf();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const checkIsLogin = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken);
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('accessToken');
    Alert.alert('알림', '로그아웃 되었습니다.');
    navigation.navigate('Login');
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkIsLogin();
  }, []);

  const scanlist = async (page) => {
    if ((isLoading && page === 1) || isFetchingMore || !hasMoreData) return;

    try {
      if (page === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('오류', '로그인이 필요합니다. 로그인 페이지로 이동합니다.', [
          { text: '확인', onPress: () => navigation.navigate('Login') },
        ]);
        return;
      }

      const res = await api.post(
        '/scan/scanlist',
        { page, limit: ITEMS_PER_PAGE },
        {
          headers: {
            'X-CSRF-Token': csrfToken,
            'Authorization': `Bearer ${accessToken}`
          },
          withCredentials: true
        }
      );

      if (res.data && Array.isArray(res.data.message)) {
        const scanItems = res.data.message.map(item => ({
          id: item.SCAN_ID.toString(),
          date: item.SCAN_DATE,
          type: item.QR_CAT === 'QR' ? 'QR 코드' : item.QR_CAT === 'IMG' ? 'QR 이미지' : 'URL',
          status: item.SCAN_RESULT === 'G' ? '클린 URL' : '악성 URL',
          content: item.SCAN_URL,
          imageUrl: item.IMAGE_URL ? item.IMAGE_URL : 'https://via.placeholder.com/150'
        }));

        if (page === 1) {
          setHistoryData(scanItems);
        } else {
          setHistoryData(prevData => {
            const newData = [...prevData, ...scanItems];
            const uniqueData = Array.from(new Map(newData.map(item => [item.id, item])).values());
            return uniqueData;
          });
        }

        setHasMoreData(scanItems.length === ITEMS_PER_PAGE);

        if (res.data.totalCount) {
          setTotalCount(res.data.totalCount);
        }
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('API 오류 발생:', error);
      if (page === 1) {
        setHistoryData([]); // Clear history data on error when loading the first page
      }
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    checkIsLogin();
    scanlist(1);
  }, []);

  const handleLoadMore = () => {
    if (!hasMoreData || isFetchingMore || isLoading) return;

    if (totalCount === 0 || historyData.length < totalCount) {
      setCurrentPage(prevPage => {
        const nextPage = prevPage + 1;
        scanlist(nextPage);
        return nextPage;
      });
    } else {
      setHasMoreData(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    return status.includes('악성') ? styles.dangerBadge : styles.safeBadge;
  };

  const getStatusTextStyle = (status) => {
    return status.includes('악성') ? styles.dangerText : styles.safeText;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'URL':
        return 'link-outline';
      case 'QR 코드':
        return 'qr-code-outline';
      case 'QR 이미지':
        return 'image-outline';
      default:
        return 'document-outline';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      month: 'long',
      day: 'numeric',
    });
  };

  const renderContentPreview = (item) => {
    if (item.content) {
      return (
        <Text style={styles.contentPreview} numberOfLines={1}>
          {item.content}
        </Text>
      );
    }
    return null;
  };

  const openURL = (url) => {
    Linking.openURL(url).catch(err => console.error("URL 열기 실패:", err));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem} 
      onPress={() => {
        if (item.status === '클린 URL') {
          openURL(item.content);
        } else if (item.status === '악성 URL') {
          Alert.alert(
            '경고',
            '이 URL은 위험할 수 있습니다. 그래도 접속하시겠습니까?',
            [
              { text: '취소', style: 'cancel' },
              { text: '접속', onPress: () => openURL(item.content) }
            ]
          );
        } else {
          Alert.alert('상세보기', '해당 항목의 자세한 내용을 확인하세요.');
        }
      }}
    >
      <View style={styles.contentContainer}>
        <View style={styles.mainInfo}>
          <View style={styles.iconContainer}>
            <Icon 
              name={getTypeIcon(item.type)} 
              size={24} 
              color="#5A9FFF"
            />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.statusContainer}>
              <Text style={styles.typeText}>{item.type}</Text>
              <View style={getStatusBadgeStyle(item.status)}>
                <Text style={getStatusTextStyle(item.status)}>{item.status}</Text>
              </View>
            </View>
            {renderContentPreview(item)}
            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <Icon name="chevron-forward-outline" size={20} color="#5A9FFF" /> 
      </View>
    </TouchableOpacity>
  );

  const getIconColor = (screen) => {
    return route.name === screen ? '#3182f6' : '#9DA3B4';
  };

  return (
    <View style={styles.container}>
      <Header title="검사 이력 보기" onBackPress={() => navigation.goBack()} />
      <View style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.subtitle}>검사 이력</Text>
          <Text style={styles.description}>QR코드 / URL / 이미지 검사 결과를 확인하세요.</Text>
        </View>
        <View style={styles.separator} />
        {isLoading ? (
          <ActivityIndicator size="large" color="#5A9FFF" />
        ) : (
          <FlatList
            data={historyData}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              historyData.length === 0 && !isLoading ? (
                <Text style={styles.emptyText}>검사 이력이 없습니다.</Text>
              ) : null
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingMore && hasMoreData ? 
                <ActivityIndicator size="large" color="#5A9FFF" /> 
                : null
            }
          />
        )}
      </View>

      {/* 하단 네비게이션 바 추가 */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={24} color="#3182f6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('History')}>
          <Icon name="time-outline" size={24} color="#9DA3B4" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('MyPage')}>
          <Icon name="person-outline" size={24} color="#9DA3B4" />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'Pretendard-Bold',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    fontFamily: 'Pretendard-Regular', 
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#E0E0E0', 
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeText: {
    fontSize: 14,
    color: '#333333',
    marginRight: 8,
    fontFamily: 'Pretendard-SemiBold',
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Pretendard-Medium',
  },
  previewContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  contentPreview: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    marginBottom: 4,
    fontFamily: 'Pretendard-Medium', 
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Pretendard-Regular', 
  },
  dangerBadge: {
    backgroundColor: '#FFE6E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dangerText: {
    color: '#D64B60',
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
  },
  safeBadge: {
    backgroundColor: '#E6F2FF', 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  safeText: {
    color: '#5A9FFF',
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
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

export default History;
