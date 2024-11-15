import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';  // useNavigation 추가
import commonStyles from '../styles/commonStyles';

const ReportImage: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();  // navigation 훅 사용
  const { imageType } = route.params;  // navigation에서 전달받은 imageType

  // imageType에 따라 다른 이미지를 렌더링
  const imageSource = imageType === 'image1'
    ? require('../assets/images/Police1.png')  // 첫 번째 이미지
    : require('../assets/images/Kisa5.png'); // 두 번째 이미지

  // 이미지 클릭 시 Report.tsx로 돌아가는 함수
  const handleImagePress = () => {
    navigation.goBack();  // Report.tsx로 돌아가기
  };

  return (
    <View style={commonStyles.containerWhite}>
     <View>
        <Image source={imageSource} style={commonStyles.reportFullImage} />
    </View>

    <TouchableOpacity style={commonStyles.fixedFooter} onPress={handleImagePress}>
    <Text style={commonStyles.footerText}>닫기</Text>
    </TouchableOpacity>
    </View>
  );
};

export default ReportImage;
