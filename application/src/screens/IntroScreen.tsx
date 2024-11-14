import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const IntroScreen = ({ navigation }) => {
  const [animation] = useState({
    scale: new Animated.Value(1), // 애니메이션 값 초기화
  });

  useEffect(() => {
    // 타이머로 홈 화면으로 이동
    const timer = setTimeout(() => {
      navigation.replace('Home'); // 'Home' 화면으로 이동
    }, 5000); // 5초 후에 메인 화면으로 이동

    // 애니메이션 루프 시작
    const animateImage = () => {
      Animated.loop(
        Animated.sequence([
          // 애니메이션 1 - 크기 증가
          Animated.timing(animation.scale, {
            toValue: 1.5, // 크기 증가
            duration: 2000,
            useNativeDriver: true,
          }),
          // 애니메이션 2 - 원래대로 되돌리기
          Animated.timing(animation.scale, {
            toValue: 1, // 원래 크기로 되돌리기
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateImage(); // 애니메이션 시작

    return () => {
      clearTimeout(timer); // 타이머 클리어
    };
  }, [navigation, animation]);

  // 단일 화면에 필요한 데이터
  const card = {
    titleImage: require('../assets/images/ThingQFulllogoWhite.png'),
    description: "위험한 QR? 바로 차단!\n Thing Q로 안전하게 스캔하세요.",
    icon: "shield-alert",
    bgColor: ['#66A3FF', '#1A5DB4'],
  };

  return (
    <LinearGradient colors={card.bgColor} style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={card.icon} size={80} color="white" />
      </View>

      {/* 애니메이션 적용된 이미지 */}
      <Animated.Image
        source={card.titleImage}
        style={[styles.titleImage, { transform: [{ scale: animation.scale }] }]}
      />

      <Text style={styles.description}>{card.description}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 20,
    marginBottom: 30,
  },
  titleImage: {
    width: 110,  
    height: 30,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginBottom: 30,
  },
});

export default IntroScreen;
