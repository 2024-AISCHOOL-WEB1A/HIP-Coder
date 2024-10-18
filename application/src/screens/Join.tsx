// import React, { useState } from 'react';
// import { View, TextInput, Text, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import commonStyles from '../styles/commonStyles';
// import CustomButton from '../components/CustomButton';

// const Join = () => {
//   const [Id, setId] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [passwordCheck, setPasswordCheck] = useState<string>('');
//   const [name, setName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [birth, setBirth] = useState<string>('');
//   const [gender, setGender] = useState<string>('');
//   const [phone, setPhone] = useState<string>('');

//   const navigation = useNavigation();

//   const handleJoin = () => {
//     console.log("회원 가입 정보:", { email, password });
//     navigation.navigate('Login');
//   };

//   return (
//     <View style={commonStyles.container}>
//       <TextInput
//         style={commonStyles.input1}
//         placeholder="ID를 입력해주세요."
//         value={Id}
//         onChangeText={setId}
//       />
//        <TouchableOpacity
//           style={commonStyles.input2}
//           onPress={() => setGender('남성')}>
//           <Text>남성</Text>
//         </TouchableOpacity>
//       <TextInput
//         style={commonStyles.input}
//         placeholder="비밀번호를 입력해주세요."
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <TextInput
//         style={commonStyles.input}
//         placeholder="비밀번호를 확인해주세요."
//         secureTextEntry
//         value={passwordCheck}
//         onChangeText={setPasswordCheck}
//       />
//       <TextInput
//         style={commonStyles.input1}
//         placeholder="이름을 입력해주세요."
//         value={name}
//         onChangeText={setName}
//       />
//       <View style={{ flexDirection: 'row', marginBottom: 10 }}>
//         <TouchableOpacity
//           onPress={() => setGender('남성')}
//           style={[commonStyles.radioButton, gender === '남성' && commonStyles.activeButton]}>
//           <Text>남성</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => setGender('여성')}
//           style={[commonStyles.radioButton, gender === '여성' && commonStyles.activeButton]}>
//           <Text>여성</Text>
//         </TouchableOpacity>
//       </View>
//       <TextInput
//         style={commonStyles.input}
//         placeholder="Email을 입력해주세요."
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={commonStyles.input}
//         placeholder="생년월일을 입력해주세요. (예: 1990-01-01)"
//         value={birth}
//         onChangeText={setBirth}
//       />



//       <TextInput
//         style={commonStyles.input}
//         placeholder="핸드폰 번호를 입력해주세요."
//         value={phone}
//         onChangeText={setPhone}
//       />

//       <CustomButton title="회원가입" onPress={handleJoin} />
//       <CustomButton title="로그인" onPress={() => navigation.navigate('Login')} />
//       {/* <Text style={commonStyles.link} onPress={() => navigation.navigate('Login')}>
//         이미 계정이 있으십니까? 로그인하시려면 여기를 클릭하세요.
//       </Text> */}
//     </View>
//   );
// };

// export default Join;


import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import CustomButton from '../components/CustomButton';

const Join = () => {
  const [Id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birth, setBirth] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const navigation = useNavigation();

  const handleJoin = () => {
    console.log("회원 가입 정보:", { email, password });
    navigation.navigate('Login');
  };

  return (
    <View style={commonStyles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TextInput
          style={commonStyles.input1}
          placeholder="ID를 입력해주세요."
          value={Id}
          onChangeText={setId}
        />
        <TouchableOpacity
          style={commonStyles.input2}
          onPress={() => console.log("중복 확인 버튼 클릭됨")}>
          <Text>중복 확인</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={commonStyles.input}
        placeholder="비밀번호를 입력해주세요."
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="비밀번호를 확인해주세요."
        secureTextEntry
        value={passwordCheck}
        onChangeText={setPasswordCheck}
      />
      <TextInput
        style={commonStyles.input1}
        placeholder="이름을 입력해주세요."
        value={name}
        onChangeText={setName}
      />
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => setGender('남성')}
          style={[commonStyles.radioButton, gender === '남성' && commonStyles.activeButton]}>
          <Text>남성</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGender('여성')}
          style={[commonStyles.radioButton, gender === '여성' && commonStyles.activeButton]}>
          <Text>여성</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={commonStyles.input}
        placeholder="Email을 입력해주세요."
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="생년월일을 입력해주세요. (예: 1990-01-01)"
        value={birth}
        onChangeText={setBirth}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="핸드폰 번호를 입력해주세요."
        value={phone}
        onChangeText={setPhone}
      />

      <CustomButton title="회원가입" onPress={handleJoin} />
      <CustomButton title="로그인" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default Join;

