import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../axios';

const { width: screenWidth } = Dimensions.get('window');

const Report: React.FC<Props> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigation = useNavigation();

  // 로그인 상태 확인
  const checkIsLoggedIn = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  };
  
   // 로그아웃 처리 함수
  const handleLogout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('accessToken');
    Alert.alert('알림', '로그아웃 되었습니다.');
    navigation.navigate('Login');
  };

   // 컴포넌트 마운트 시 로그인 상태 확인
   useEffect(() => {
    checkIsLoggedIn();
  }, []);


  // 신고하기 클릭 시 외부 링크로 이동
  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  // 상태 관리: 클릭된 박스에 따라 보여줄 콘텐츠 변경
  const [selectedBox, setSelectedBox] = useState<'none' | 'box2' | 'box2Banner2'>('none');

  // box2 클릭 시 ReportImage로 이동
  const handleBox2Click = () => {
    navigation.navigate('ReportImage', { imageType: 'image1' });
  };

  // box2Banner2 클릭 시 ReportImage로 이동
  const handleBox2Banner2Click = () => {
    navigation.navigate('ReportImage', { imageType: 'image2' });
  };


  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headerContainer}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} title="신고하기" onBackPress={() => navigation.goBack()} />
      </View>

      <View style={commonStyles.formContainer}>
        <View style={commonStyles.innerContainer2}>

          {/* 경찰청 신고 */}
          <View style={commonStyles.box1}>
            <View style={commonStyles.circleContainer}>
              <Image
                source={require('../assets/images/Police.png')}
                style={commonStyles.circleImage}
              />
            </View>
            <View style={commonStyles.view4}>
              <View style={commonStyles.textContainer}>
                <Text style={commonStyles.textNextToImageTitle}>경찰청</Text>
                <Text style={commonStyles.textNextToImage}>대표번호 : 112</Text>
              </View>
              <TouchableOpacity onPress={() => handleLinkPress('https://ecrm.police.go.kr/minwon/main')}>
                <View style={commonStyles.reportButtonContainer}>
                  <Image
                    source={require('../assets/images/Report.png')}
                    style={commonStyles.reportImage}
                  />
                  <Text style={commonStyles.textNextToImage}>신고하기</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* 금융감독원 신고 */}
          <View style={commonStyles.box1}>
            <View style={commonStyles.circleContainer}>
              <Image
                source={require('../assets/images/Fss.png')}
                style={commonStyles.circleImage}
              />
            </View>
            <View style={commonStyles.view4}>
              <View style={commonStyles.textContainer}>
                <Text style={commonStyles.textNextToImageTitle}>금융감독원</Text>
                <Text style={commonStyles.textNextToImage}>대표번호 : 1332</Text>
              </View>
              <TouchableOpacity onPress={() => handleLinkPress('https://www.fss.or.kr/fss/main/sub1.do?menuNo=201093')}>
                <View style={commonStyles.reportButtonContainer}>
                  <Image
                    source={require('../assets/images/Report.png')}
                    style={commonStyles.reportImage}
                  />
                  <Text style={commonStyles.textNextToImage}>신고하기</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* KISA 신고 */}
          <View style={commonStyles.box1}>
            <View style={commonStyles.circleContainer}>
              <Image
                source={require('../assets/images/Kisa.png')}
                style={commonStyles.circleImage}
              />
            </View>
            <View style={commonStyles.view4}>
              <View style={commonStyles.textContainer}>
                <Text style={commonStyles.textNextToImageTitle}>KISA 한국인터넷진흥원</Text>
                <Text style={commonStyles.textNextToImage}>대표번호 : 118</Text>
              </View>
              <TouchableOpacity onPress={() => handleLinkPress('https://www.boho.or.kr/kr/consult/consultForm.do?menuNo=205035&mConNo=94')}>
                <View style={commonStyles.reportButtonContainer}>
                  <Image
                    source={require('../assets/images/Report.png')}
                    style={commonStyles.reportImage}
                  />
                  <Text style={commonStyles.textNextToImage}>신고하기</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* box2 클릭 시 이미지 1을 보여주는 ReportImage 화면으로 이동 */}
          <TouchableOpacity onPress={handleBox2Click} style={commonStyles.box2Banner1}>
            <Image
              source={require('../assets/images/Banner1.png')}
              style={commonStyles.boxImageBanner1}
            />
          </TouchableOpacity>

          {/* box2Banner2 클릭 시 이미지 2를 보여주는 ReportImage 화면으로 이동 */}
          <TouchableOpacity onPress={handleBox2Banner2Click} style={commonStyles.box2Banner2}>
            <Image
              source={require('../assets/images/Banner2.png')}
              style={commonStyles.boxImageBanner2}
            />
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

export default Report;


