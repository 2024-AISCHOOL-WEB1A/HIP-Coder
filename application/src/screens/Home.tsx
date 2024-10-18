// import React from 'react'
// import { View, Text, Button } from 'react-native'
// import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // 추가
// import { RootStackParamList } from '../../types'; // 이 부분은 아래에서 설명

// type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// interface Props {
//   navigation: HomeScreenNavigationProp;
// }

// const Home: React.FC<Props> = ({ navigation }) => {
//   return (
//     <View>
//         <Text>home</Text>
//         <Button
//             title="Go to Join"
//             onPress={() => navigation.navigate('Join')} // 'Join' 페이지로 이동
//       />
//     </View>
//   )
// }

// export default Home


import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import CustomButton from '../components/CustomButton';


const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>HIP - GUARD</Text>
      <CustomButton title="회원가입" onPress={() => navigation.navigate('Join')} />
      <CustomButton title="로그인" onPress={() => navigation.navigate('Login')} />
      <CustomButton title="내 정보" onPress={() => navigation.navigate('MyPage')} />
      <CustomButton title="QR 스캔" onPress={() => navigation.navigate('QrScan')} />
      <CustomButton title="URL 검사" onPress={() => navigation.navigate('UrlCheck')} />
    </View>
  );
};

export default Home;