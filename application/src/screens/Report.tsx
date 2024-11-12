import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'; 
import { useNavigation } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; 
import { RootStackParamList } from '../../types'; 
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles'; 
import HEButton from '../components/HEButton';
import axios from 'axios';

// type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// interface Props {
//   navigation: HomeScreenNavigationProp;
//   // csrfToken: string | null;
// }

const Report: React.FC<Props> = () => {
  const navigation = useNavigation();

  // 신고하기 클릭 시 외부 링크로 이동
  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headerContainer}>
        <Header title="신고하기" onBackPress={() => navigation.goBack()} />
        {/* <Text style={commonStyles.headerTitle}>신고하기</Text> */}
      </View>
      <View style={commonStyles.formContainer}>

        <View style={commonStyles.innerContainer2}>
          <View style={commonStyles.wheel1}>

            {/* 경찰청 신고 */}
            <View style={commonStyles.box1}>
              <View style={commonStyles.circleContainer}>
                <Image
                  source={require('../assets/images/Police.png')}
                  style={commonStyles.circleImage}
                />
              </View>
              <TouchableOpacity onPress={() => handleLinkPress('https://ecrm.police.go.kr/minwon/main')}>
                <Text style={commonStyles.textCenter}>경찰청{'\n'}112{'\n'}신고하기</Text>
              </TouchableOpacity>
            </View>

            {/* 금융감독원 신고 */}
            <View style={commonStyles.box1}>
              <View style={commonStyles.circleContainer}>
                <Image
                  source={require('../assets/images/Fss.png')}
                  style={commonStyles.circleImage}
                />
              </View>
              <TouchableOpacity onPress={() => handleLinkPress('https://www.fss.or.kr/fss/main/sub1.do?menuNo=201093')}>
                <Text style={commonStyles.textCenter}>금융감독원{'\n'}1332{'\n'}신고하기</Text>
              </TouchableOpacity>
            </View>

            {/* KISA 신고 */}
            <View style={commonStyles.box1}>
              <View style={commonStyles.circleContainer}>
                <Image
                  source={require('../assets/images/Kisa.png')}
                  style={commonStyles.circleImage}
                />
              </View>
              <TouchableOpacity onPress={() => handleLinkPress('https://www.boho.or.kr/kr/consult/consultForm.do?menuNo=205035&mConNo=94')}>
                <Text style={commonStyles.textCenter}>KISA{'\n'} 118{'\n'}신고하기</Text>
              </TouchableOpacity>
            </View>

          </View>

          <View style={commonStyles.box2}>
            <Image
              source={require('../assets/images/Police1.png')}
              style={commonStyles.boxImage}
            />
          </View>

        </View>

      </View>
    </View>
  );
};

export default Report;




// import React, { useState } from 'react';
// import { View, TextInput, Button, Alert, Text, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../types';
// import Header from '../components/BGHeader';
// import commonStyles from '../styles/commonStyles';
// import HEButton from '../components/HEButton';
// import axios from 'axios';

// type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// interface Props {
//   navigation: HomeScreenNavigationProp;
//   // csrfToken: string | null;
// }



// const Report: React.FC<Props> = () => {

//     const navigation = useNavigation();


//   return (
//     <View style={commonStyles.container}>
//       <View style={commonStyles.headerContainer}>
//         <Header onBackPress={() => navigation.goBack()} />
//           <Text style={commonStyles.headerTitle}>신고하기</Text>
//       </View>
//         <View style={commonStyles.formContainer}>

//           <View style={commonStyles.innerContainer2}>
//             <View style={commonStyles.wheel1}>

//               {/* <View style={commonStyles.box0}> */}
//                 <View style={commonStyles.box1}>
//                   <View style={commonStyles.circleContainer}>
//                     <Image
//                       source={require('../assets/images/Police.png')}
//                       style={commonStyles.circleImage}
//                     />
//                   </View>
//                   {/* <Text style={commonStyles.circleText}>경찰청</Text> */}
//                 <Text style={commonStyles.textCenter}>경찰청{'\n'}112{'\n'}신고하기</Text>
//                   {/* : https://ecrm.police.go.kr/minwon/main */}
//               </View>
//               {/* </View> */}

//               {/* <View style={commonStyles.box0}> */}
//               <View style={commonStyles.box1}>
//                 <View style={commonStyles.circleContainer}>
//                   <Image
//                     source={require('../assets/images/Fss.png')}
//                     style={commonStyles.circleImage}
//                   />
//                 {/* <Text style={commonStyles.circleText}>금융감독원</Text> */}
//                 </View>
//                 <Text style={commonStyles.textCenter}>금융감독원{'\n'}1332{'\n'}신고하기
//                   {/* : https://www.fss.or.kr/fss/main/sub1.do?menuNo=201093 */}
//                 </Text>
//               </View>
//               {/* </View> */}

//               {/* <View style={commonStyles.box0}> */}
//               <View style={commonStyles.box1}>
//                 <View style={commonStyles.circleContainer}>
//                   <Image
//                     source={require('../assets/images/Kisa.png')}
//                     style={commonStyles.circleImage}
//                   />
//                 {/* <Text style={commonStyles.circleText}>KISA</Text> */}
//                 </View>
//                 <Text style={commonStyles.textCenter}>KISA{'\n'} 118{'\n'}신고하기
//                   {/* : https://www.boho.or.kr/kr/consult/consultForm.do?menuNo=205035&mConNo=94 */}
//                 </Text>
//               </View>
//             </View>
//             {/* </View> */}

//            <View style={commonStyles.box2}>
//            <Image
//              source={require('../assets/images/Police1.png')}
//              style={commonStyles.boxImage}/>
//            </View>

//            </View>
   
//         </View>
//     </View>
//   );
// };



// export default Report;
