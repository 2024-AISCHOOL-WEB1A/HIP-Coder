import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';

const ReportImage: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { imageType } = route.params;

  // imageType에 따라 다른 이미지를 렌더링
  const imageSource = imageType === 'image1'
    ? 'https://jsh-1.s3.ap-northeast-2.amazonaws.com/hipcoder/Police1.png'
    : 'https://jsh-1.s3.ap-northeast-2.amazonaws.com/hipcoder/Kisa1.png'

  // 이미지 클릭 시 Report.tsx로 돌아가는 함수
  const handleImagePress = () => {
    navigation.goBack();
  };

  return (
    <View style={commonStyles.containerWhite}>
      <Image source={{ uri: imageSource}} style={commonStyles.reportFullImage} />

      <TouchableOpacity style={commonStyles.fixedFooter} onPress={handleImagePress}>
        <Text style={commonStyles.footerText}>닫기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportImage;
