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
      <Text style={commonStyles.header}>Welcome to the Anti-Phishing QR Scanner App</Text>
      <Button title="Join" style={CustomButton.CustomButton} onPress={() => navigation.navigate('Join')} />
      <Button title="Login" style={CustomButton.CustomButton} onPress={() => navigation.navigate('Login')} />
      <Button title="My Page" style={CustomButton.CustomButton} onPress={() => navigation.navigate('MyPage')} />
      <Button title="QR Scan" style={CustomButton.CustomButton} onPress={() => navigation.navigate('QrScan')} />
      <Button title="URL Check" style={CustomButton.CustomButton} onPress={() => navigation.navigate('UrlCheck')} />
    </View>
  );
};

export default Home;