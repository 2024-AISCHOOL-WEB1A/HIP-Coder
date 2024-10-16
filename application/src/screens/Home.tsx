import React from 'react'
import { View, Text, Button } from 'react-native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // 추가
import { RootStackParamList } from '../../types'; // 이 부분은 아래에서 설명

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const Home: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
        <Text>home</Text>
        <Button
            title="Go to Join"
            onPress={() => navigation.navigate('Join')} // 'Join' 페이지로 이동
        />
        <Button
            title="Go to Test"
            onPress={() => navigation.navigate('Test')} // 'Join' 페이지로 이동
        />
    </View>
  )
}

export default Home