import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Animated, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title = '', onBackPress, isLoggedIn, onLogout }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(500)).current;

  const menuItems = [
    { label: 'Home', icon: 'home-outline', action: () => navigation.navigate('Home') },
    { label: '신고하기', icon: 'notifications-outline', action: () => navigation.navigate('Report') },
    { label: '내정보', icon: 'person-outline', action: () => navigation.navigate('MyPage') },
    { label: 'QR 스캔', icon: 'scan-outline', action: () => navigation.navigate('QrScan') },
    { label: 'URL 검사', icon: 'link-outline', action: () => navigation.navigate('UrlCheck') },
    { label: 'QR 이미지 검사', icon: 'images-outline', action: () => navigation.navigate('GalleryQrScan') },
  ];

  const openSidebar = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.iconContainer}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={openSidebar} style={styles.iconContainer}>
        <Icon name="menu" size={24} color="#ffffff" />
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeSidebar}
      >
        <TouchableOpacity style={styles.overlay} onPress={closeSidebar} />
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]} >
          <View style={styles.sidebarHeader}>
            <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
              <Icon name="close-outline" size={30} color="#4A148C" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileSection}>
            <Image source={{ uri: 'path/to/profile-picture' }} style={styles.profileImage} />
            <Text style={styles.profileName}>큐싱의 모든것. Thing Q</Text>
          </View>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                item.action();
                closeSidebar();
              }} style={styles.menuItem}>
                <Icon name={item.icon} size={20} color="#3182f6" style={styles.menuIcon} />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={() => {
            if (isLoggedIn) {
              onLogout();
            } else {
              navigation.navigate('Login');
            }
            closeSidebar();
          }} style={styles.menuItem}>
            <Icon name="log-out-outline" size={20} color="#3182f6" style={styles.menuIcon} />
            <Text style={styles.menuItemText}>{isLoggedIn ? '로그아웃' : '로그인'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  title: {
    padding: 10,
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Pretendard-Bold',
  },
  iconContainer: {
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    width: '70%',
    height: '100%',
    backgroundColor: '#F9F9F9', 
    padding: 20,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    right: 0,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  closeButton: {
    padding: 10,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    color: '#0D47A1',
    fontFamily: 'Pretendard-SemiBold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Pretendard-Regular',
  },
});

export default Header;