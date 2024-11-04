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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.historyItem} onPress={() => { /* 상세보기 로직 */ }}>
      <Icon name="search-outline" size={24} color="#9C59B5" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Text style={styles.historyType}>감지된 {item.type} : {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="" onBackPress={() => navigation.goBack()} />
      <View style={styles.scrollContainer}>
        <Text style={styles.subtitle}>QR코드 / URL 검사 결과</Text>
        <View style={styles.separator} />
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
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
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  icon: {
    backgroundColor: '#EFEFEF',
    borderRadius: 16,
    padding: 10,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  historyDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1D1E',
  },
  historyType: {
    fontSize: 16,
    color: '#9C59B5',
    marginTop: 4,
  },
});

export default History;
