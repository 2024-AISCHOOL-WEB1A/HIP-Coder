import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  isLoggedIn: boolean; // 로그인 상태를 받는 prop
  onLogout: () => void; // 로그아웃 함수
}

const Header: React.FC<HeaderProps> = ({ title = '', onBackPress, isLoggedIn, onLogout }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const menuItems = [
    { label: 'Home', action: () => navigation.navigate('Home') }, // Home으로 이동
    { label: '회원가입', action: () => navigation.navigate('Join') },
    { label: '내정보', action: () => navigation.navigate('MyPage') },
    { label: 'QR 스캔', action: () => navigation.navigate('QrScan') },
    { label: 'URL 검사', action: () => navigation.navigate('UrlCheck') },
  ];

  return (
    <View style={styles.container}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.iconContainer}>
          <Icon name="arrow-back" size={24} color="#6A1B9A" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconContainer}>
        <Icon name="menu" size={24} color="#6A1B9A" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={menuItems}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  item.action();
                  setModalVisible(false);
                }} style={styles.menuItem}>
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            {isLoggedIn ? (
              <TouchableOpacity onPress={() => {
                onLogout();
                setModalVisible(false);
              }} style={styles.menuItem}>
                <Text style={styles.menuItemText}>로그아웃</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => {
                console.log('로그인 클릭');
                setModalVisible(false);
              }} style={styles.menuItem}>
                <Text style={styles.menuItemText}>로그인</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  iconContainer: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  menuItem: {
    paddingVertical: 15,
  },
  menuItemText: {
    fontSize: 18,
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#9C59B5',
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Header;
