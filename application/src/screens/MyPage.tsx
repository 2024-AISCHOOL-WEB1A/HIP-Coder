import React from 'react';
import { View, Text, FlatList } from 'react-native';
import commonStyles from '../styles/commonStyles';

const MyPage = () => {
  const urlRecords = [
    { id: '1', url: 'http://example.com', status: '안전' },
    { id: '2', url: 'http://phishing-site.com', status: '피싱' },
  ];

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>내 정보</Text>
      <FlatList
        data={urlRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={commonStyles.record}>
            <Text style={commonStyles.url}>{item.url}</Text>
            <Text style={commonStyles.status}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default MyPage;