import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import CustomButton from '../components/CustomButton';

const UrlCheck = () => {
  const [url, setUrl] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const checkUrl = () => {
    console.log("URL 체크:", url);
    setResult("안전");
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>URL 검사</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Enter URL"
        value={url}
        onChangeText={setUrl}
      />
      <CustomButton title="Check URL" onPress={checkUrl} />
      {result ? <Text style={commonStyles.result}>결과: {result}</Text> : null}
    </View>
  );
};

export default UrlCheck;