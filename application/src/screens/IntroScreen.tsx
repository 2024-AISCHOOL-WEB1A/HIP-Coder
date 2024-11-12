import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const IntroScreen = ({ navigation }) => {
  const [animation] = useState({
    fontWeight: new Animated.Value(100), // 애니메이션 값 초기화
    fontSize: new Animated.Value(24), // 기본 폰트 사이즈
  });

  useEffect(() => {
    // 타이머로 홈 화면으로 이동
    const timer = setTimeout(() => {
      navigation.replace('Home'); // 'Home' 화면으로 이동
    }, 5000); // 5초 후에 메인 화면으로 이동

    // 애니메이션 루프 시작
    const animateText = () => {
      Animated.loop(
        Animated.sequence([
          // 애니메이션 1 - 폰트 무게와 크기 증가
          Animated.timing(animation.fontWeight, {
            toValue: 700, // 최대 무게로 변경
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(animation.fontSize, {
            toValue: 40, // 폰트 크기 증가
            duration: 2000,
            useNativeDriver: false,
          }),
          // 애니메이션 2 - 원래대로 되돌리기
          Animated.timing(animation.fontWeight, {
            toValue: 100, // 원래 무게로 되돌리기
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(animation.fontSize, {
            toValue: 24, // 원래 크기로 되돌리기
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateText(); // 애니메이션 시작

    return () => {
      clearTimeout(timer); // 타이머 클리어
    };
  }, [navigation, animation]);

  // 단일 화면에 필요한 데이터
  const card = {
    title: "Thing Q ",
    description: "위험한 QR? 바로 차단!\n Thing Q로 안전하게 스캔하세요.",
    icon: "shield-alert",
    bgColor: ['#66A3FF', '#1A5DB4'],
  };

  return (
    <LinearGradient colors={card.bgColor} style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={card.icon} size={80} color="white" />
      </View>

      {/* 애니메이션 적용된 Text */}
      <Animated.Text
        style={[
          styles.title,
          {
            fontWeight: animation.fontWeight.interpolate({
              inputRange: [100, 700],
              outputRange: ['100', '700'], 
            }),
            fontSize: animation.fontSize,
          },
        ]}
      >
        {card.title}
      </Animated.Text>
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
  title: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
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
