import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

const History = () => {
  const navigation = useNavigation();

  const data = [
    { id: '1', date: '2024-10-14', type: 'URL', status: '악성 URL' },
    { id: '2', date: '2024-09-30', type: 'URL', status: '클린 URL' },
    { id: '3', date: '2024-09-20', type: 'QR 코드', status: '악성 코드' },
    { id: '4', date: '2024-09-12', type: 'URL', status: '악성 URL' },
    { id: '5', date: '2024-08-27', type: 'QR 코드', status: '악성 코드' },
    { id: '6', date: '2024-08-18', type: 'QR 코드', status: '클린 코드' },
    { id: '7', date: '2024-08-06', type: 'URL', status: '클린 URL' },
    { id: '8', date: '2024-07-10', type: 'QR 코드', status: '악성 코드' },
  ];

  const getStatusBadgeStyle = (status) => {
    return status.includes('악성') 
      ? styles.dangerBadge 
      : styles.safeBadge;
  };

  const getStatusTextStyle = (status) => {
    return status.includes('악성') 
      ? styles.dangerText 
      : styles.safeText;
  };

  const getTypeIcon = (type) => {
    return type === 'URL' ? 'link-outline' : 'qr-code-outline';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      month: 'long',
      day: 'numeric',
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem} 
      onPress={() => { /* 상세보기 로직 */ }}
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
          <Text style={styles.description}>QR코드 / URL 검사 결과를 확인하세요</Text>
        </View>
        <View style={styles.separator} />
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
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
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    marginRight: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
  // 악성 상태 배지
  dangerBadge: {
    backgroundColor: '#FFE6E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dangerText: {
    color: '#D64B60',
    fontSize: 12,
    fontWeight: '600',
  },
  // 클린 상태 배지
  safeBadge: {
    backgroundColor: '#F0E6F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  safeText: {
    color: '#9C59B5',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default History;