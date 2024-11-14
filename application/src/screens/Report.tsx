import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles';
// import Carousel from 'react-native-snap-carousel';
// import { ViewStyle } from 'react-native';

import axios from 'axios';

// type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// interface Props {
//   navigation: HomeScreenNavigationProp;
//   // csrfToken: string | null;
// }

const { width: screenWidth } = Dimensions.get('window');

const Report: React.FC<Props> = () => {
  const navigation = useNavigation();

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
        <Header title="신고하기" onBackPress={() => navigation.goBack()} />
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
          <TouchableOpacity onPress={handleBox2Click} style={commonStyles.box2}>
            <Image
              source={require('../assets/images/Banner1.png')}
              style={commonStyles.boxImage}
            />
          </TouchableOpacity>

          {/* box2Banner2 클릭 시 이미지 2를 보여주는 ReportImage 화면으로 이동 */}
          <TouchableOpacity onPress={handleBox2Banner2Click} style={commonStyles.box2Banner2}>
            <Image
              source={require('../assets/images/Banner2.png')}
              style={commonStyles.boxImageBanner2}
            />
          </TouchableOpacity>

          
           {/* <View style={commonStyles.box2}>
             <Image
              source={require('../assets/images/Banner1.png')}
              style={commonStyles.boxImage}
            />
          </View>

          <View style={commonStyles.box2Banner2}>
            <Image
              source={require('../assets/images/Banner2.png')}
              style={commonStyles.boxImageBanner2}
            />
          </View> */}

        </View>
      </View>
    </View>
  );
};

export default Report;


