import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';

const UrlCheck = () => {
  const [url, setUrl] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const checkUrl = () => {
    console.log("URL 체크:", url);
    setResult("Safe");
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>URL Check</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Enter URL"
        value={url}
        onChangeText={setUrl}
      />
      <Button title="Check URL" onPress={checkUrl} />
      {result ? <Text style={commonStyles.result}>Result: {result}</Text> : null}
    </View>
  );
};

export default UrlCheck;