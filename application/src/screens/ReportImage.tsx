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
      <Text style={commonStyles.text}>선택된 이미지: {imageType === 'image1' ? 'Police1' : 'Kisa5'}</Text>
    </View>

    <TouchableOpacity style={commonStyles.fixedFooter} onPress={handleImagePress}>
    <Text style={commonStyles.footerText}>닫기</Text>
    </TouchableOpacity>
    </View>
  );
};

export default ReportImage;



// import React from 'react';
// import { View, Image, Text, TouchableOpacity } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';  // useNavigation 추가
// import commonStyles from '../styles/commonStyles';

// const ReportImage: React.FC = () => {
//   const route = useRoute();
//   const navigation = useNavigation();  // navigation 훅 사용
//   const { imageType } = route.params;  // navigation에서 전달받은 imageType

//   // imageType에 따라 다른 이미지를 렌더링
//   const imageSource = imageType === 'image1'
//     ? require('../assets/images/Police1.png')  // 첫 번째 이미지
//     : require('../assets/images/Kisa5.png'); // 두 번째 이미지

//   // 이미지 클릭 시 Report.tsx로 돌아가는 함수
//   const handleImagePress = () => {
//     navigation.goBack();  // Report.tsx로 돌아가기
//   };

//   return (
//     <View style={commonStyles.containerWhite}>
//       <TouchableOpacity onPress={handleImagePress}>
//         <Image source={imageSource} style={commonStyles.reportFullImage} />
//       </TouchableOpacity>
//       <Text style={commonStyles.text}>선택된 이미지: {imageType === 'image1' ? 'Police1' : 'Kisa5'}</Text>
//     </View>
//   );
// };

// export default ReportImage;



// import React from 'react';
// import { View, Image, Text } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import commonStyles from '../styles/commonStyles';

// const ReportImage: React.FC = () => {
//   const route = useRoute();
//   const { imageType } = route.params;  // navigation에서 전달받은 imageType

//   // imageType에 따라 다른 이미지를 렌더링
//   const imageSource = imageType === 'image1' 
//     ? require('../assets/images/Police1.png')  // 첫 번째 이미지
//     : require('../assets/images/Kisa5.png'); // 두 번째 이미지

//   return (
//     <View style={commonStyles.containerWhite}>
//       <Image source={imageSource} style={commonStyles.reportFullImage} />
//       <Text style={commonStyles.text}>선택된 이미지: {imageType === 'image1' ? 'Police1' : 'Kisa5'}</Text>
//     </View>
//   );
// };

// export default ReportImage;



// import React from 'react';
// import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import Header from '../components/BGHeader';
// import commonStyles from '../styles/commonStyles';

// type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// const ReportImage: React.FC = () => {
//   const navigation = useNavigation<HomeScreenNavigationProp>();
//   const route = useRoute();
//   const { termType } = route.params;

// //   // 약관 유형에 따라 헤더 타이틀 설정
// //   const headerTitle = termType === 'personalInfo' 
// //     ? '개인정보 수집·이용에 대한 약관' 
// //     : '만 14세 이상에 대한 약관';


// //     const termsTextPerson= `

// // `;


// // const termsTextAge= `

// // `;


//   return (
//     <View style={commonStyles.containerWhite}>
//       {/* <View style={commonStyles.headerContainer}>
//         <Header onBackPress={() => navigation.goBack()} />
//         <Text style={commonStyles.termsHeaderTitle}>{headerTitle}</Text>
//       </View>
//       <ScrollView>
//         {termType === 'personalInfo' && (
//           <>
//             <Text style={commonStyles.text3}>
//               {termsTextPerson}
//             </Text>
//           </>
//         )}
//         {termType === 'ageRestriction' && (
//           <>
//             <Text style={commonStyles.text3}>
//                 {termsTextAge}
//             </Text>
//           </>
//         )}
//       </ScrollView>
      
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         <Text style={{ color: 'blue', textAlign: 'right', marginTop: 20 }}>닫기</Text>
//       </TouchableOpacity> */}
//     </View>
//   );
// };

// export default ReportImage;
