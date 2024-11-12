import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Animated, Image, Easing } from 'react-native';
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

  const username = "ooo"; // 예시 사용자 이름

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
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: 500,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.iconContainer}>
          <Icon name="arrow-back" size={24} color="#0D47A1" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={openSidebar} style={styles.iconContainer}>
        <Icon name="menu" size={24} color="#0D47A1" />
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeSidebar}
      >
        <TouchableOpacity style={styles.overlay} onPress={closeSidebar} />
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.sidebarHeader}>
            <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
              <Icon name="close-outline" size={30} color="#0D47A1" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileSection}>
            <Image source={require('../assets/images/ThingQFulllogo.png')} style={styles.logoImage} />
            {isLoggedIn ? (
              <Text style={styles.welcomeText}>{`${username}님, 환영합니다!`}</Text>
            ) : (
              <Text style={styles.profileName}>큐싱의 모든것 , Thing Q</Text>
            )}
          </View>
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => {
                item.action();
                closeSidebar();
              }} style={styles.menuItem}>
                <Icon name={item.icon} size={22} color="#3182f6" style={styles.menuIcon} />
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
            <Icon name="log-out-outline" size={22} color="#3182f6" style={styles.menuIcon} />
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
    fontSize: 22,
    color: '#0D47A1',
    textAlign: 'left',
    fontFamily: 'Pretendard-Bold',
    marginLeft: 15,
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
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'flex-start',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    right: 0,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  closeButton: {
    padding: 10,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20, // 로고와 상단 여백
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  profileName: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 5,
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Pretendard-SemiBold',
    marginTop: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Pretendard-Regular',
  },
  menuIcon: {
    marginRight: 15,
  },
  selectedMenuItem: {
    backgroundColor: '#e6f0ff',
  },
});

export default Header;
