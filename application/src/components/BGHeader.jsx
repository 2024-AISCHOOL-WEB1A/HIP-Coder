import React, { useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title = '', onBackPress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const menuItems = [
    { label: 'Home', action: () => navigation.navigate('Home') },
    { label: '회원가입', action: () => navigation.navigate('Join') },
    { label: '내정보', action: () => navigation.navigate('MyPage') },
    { label: 'QR 스캔', action: () => navigation.navigate('QrScan') },
    { label: 'URL 검사', action: () => navigation.navigate('UrlCheck') },
  ];

  return (
    <View style={styles.container}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.iconContainer}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconContainer}>
        <Icon name="menu" size={24} color="#ffffff" />
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
    // backgroundColor: '#9C59B5',
    width: '100%',
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between', // 좌우 아이콘 사이 공간 균등 분배
    alignItems: 'center',
    position: 'absolute', // 헤더를 화면 상단에 고정
    top: 0,
    zIndex: 10,
  },
  // title: {
  //   fontSize: 24,
  //   color: '#000',
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   flex: 1, // 제목이 중앙에 위치하도록 설정
  //   paddingVertical: 15, // 수직 중앙 정렬을 위한 패딩 추가
  // },
  iconContainer: {
    padding: 10, // 아이콘 주위에 여백 추가
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
    backgroundColor: '#ffffff',
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Header;
