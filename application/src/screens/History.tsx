import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../axios';
import { useCsrf } from '../../context/CsrfContext';

const ITEMS_PER_PAGE = 5;

const History = () => {
  const navigation = useNavigation();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const { csrfToken } = useCsrf();
  const [scandata, setScandata] = useState({
    id : '',
    date : '',
    type : '',
    status : '',
    content : ''
  });

  // scanlist 함수 수정
  const scanlist = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다. 로그인 페이지로 이동합니다.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
        return;
      }
      const res = await api.post(
        '/scan/scanlist',
        {},
        {
          headers: {
            'X-CSRF-Token': csrfToken,
            'Authorization': `Bearer ${token}`
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
          imageUrl: item.QR_CAT === 'IMG' ? 'path/to/your/image' : undefined // QR 이미지인 경우만 imageUrl 추가
        }));

        // 받아온 데이터를 historyData로 설정하여 리스트에 반영합니다.
        setHistoryData(scanItems);
        setTotalPages(Math.ceil(scanItems.length / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error('API 오류 발생:', error);
      if (error.response && error.response.status === 403) {
        Alert.alert('오류', '로그인이 필요합니다. 로그인 페이지로 이동합니다.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        Alert.alert('오류', '사용자 데이터를 가져오는 중 오류가 발생했습니다.');
      }
    }
  };

  // useEffect에서 scanlist 호출
  useEffect(() => {
    scanlist();
  }, []);

  // 페이지네이션 관련 데이터 설정
  useEffect(() => {
    setTotalPages(Math.ceil(historyData.length / ITEMS_PER_PAGE)); 
    loadData(currentPage);
  }, [currentPage]);

  const loadData = (page: number) => {
    setIsLoading(true);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const currentData = historyData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    setHistoryData(currentData);
    setIsLoading(false);
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
    if (item.type === 'QR 이미지' && item.imageUrl) {
      return (
        <View style={styles.previewContainer}>
          <Image 
            source={{ 
              uri: item.imageUrl || 'https://via.placeholder.com/150'
            }} 
            style={styles.previewImage}
          />
        </View>
      );
    }
    if (item.content) {
      return (
        <Text style={styles.contentPreview} numberOfLines={1}>
          {item.content}
        </Text>
      );
    }
    return null;
  };

  useEffect(() => {
    scanlist()
  }, [])

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
      }
    }
    >
      <View style={styles.contentContainer}>
        <View style={styles.mainInfo}>
          <View style={styles.iconContainer}>
            <Icon 
              name={getTypeIcon(item.type)} 
              size={24} 
              color="#9C59B5"
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
        <Icon name="chevron-forward-outline" size={20} color="#9C59B5" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="" onBackPress={() => navigation.goBack()} />
      <View style={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.subtitle}>검사 이력</Text>
          <Text style={styles.description}>QR코드 / URL / 이미지 검사 결과를 확인하세요.</Text>
        </View>
        <View style={styles.separator} />
        <FlatList
          data={historyData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>검사 이력이 없습니다.</Text>}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
        />
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
    fontSize: 22,
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
    backgroundColor: '#B490CA',
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F0E6F5',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#F0E6F5',
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
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0E6F5',
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
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  safeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontFamily: 'Pretendard-SemiBold',
  },
});

export default History;
