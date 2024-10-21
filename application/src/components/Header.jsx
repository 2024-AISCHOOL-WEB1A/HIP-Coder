import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title = '', onBackPress }) => {
  return (
    <View style={styles.container}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.iconContainer}>
          <Icon name="arrow-back" size={24} color="#6A1B9A" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="close" size={24} color="#6A1B9A" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between', // 좌우 아이콘 사이 공간 균등 분배
    alignItems: 'center',
    position: 'absolute', // 헤더를 화면 상단에 고정
    top: 0, 
    zIndex: 10, 
  },
  title: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // 제목이 중앙에 위치하도록 설정
  },
  iconContainer: {
    padding: 10, // 아이콘 주위에 여백 추가
  },
});

export default Header;
