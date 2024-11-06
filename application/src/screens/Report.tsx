import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from '../components/BGHeader';
import commonStyles from '../styles/commonStyles';
import HEButton from '../components/HEButton';
import axios from 'axios';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
  // csrfToken: string | null;
}



const Report: React.FC<Props> = () => {

    const navigation = useNavigation();


  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.headerContainer}>
        <Header onBackPress={() => navigation.goBack()} />
          <Text style={commonStyles.headerTitle}>신고하기</Text>
      </View>
        <View style={commonStyles.formContainer}>
          <View style={commonStyles.innerContainer}>
            <View style={commonStyles.view1}>
                <View style={commonStyles.circleContainer1}>
                    <Image
                        source={require('../assets/images/Fss.png')}
                        style={commonStyles.circleImage}
                    />
                </View>
                <View style={commonStyles.circleContainer}>
                    <Image
                        source={require('../assets/images/Police.png')}
                        style={commonStyles.circleImage}
                    />
                </View>
                <View style={commonStyles.circleContainer}>
                    <Image
                        source={require('../assets/images/Kisa.png')}
                        style={commonStyles.circleImage}
                    />
                </View>
            </View>
            {/* <View style={commonStyles.view1}> */}
            {/* <View style={[commonStyles.view1, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Text>금융감독원</Text>
                <Text>경찰청</Text>
                <Text>KISA</Text>
                <Text>KISA</Text>
            </View> */}
            <View style={[commonStyles.view1, { flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 0 }]}>
                <Text style={{ margin: 0, textAlign: 'center' }}>금융감독원</Text>
                <Text style={{ margin: 0, textAlign: 'center' }}>경찰청</Text>
                <Text style={{ margin: 0, textAlign: 'center' }}>KISA</Text>

                                
            </View>

           <View style={commonStyles.box1}></View>
           
           <View style={commonStyles.box2}></View>
    
          </View>
        </View>
    </View>
  );
};



export default Report;







// import React, { useState } from 'react';
// import { View, Text, Alert, TextInput, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../types';
// import axios from 'axios';
// import commonStyles from '../styles/commonStyles';
// import HEButton from '../components/HEButton';
// import Header from '../components/BGHeader';
// import { Linking } from 'react-native';

// type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// interface Props {
//   navigation: HomeScreenNavigationProp;
//   scannedData: string | null;  // QR 코드로 스캔된 정보 (전화번호, URL 등)
// }

// const Report: React.FC<Props> = ({ scannedData }) => {
//   const [url, setUrl] = useState('');
//   const [reporterName, setReporterName] = useState('');
//   const [reporterContact, setReporterContact] = useState('');
//   const [reportContent, setReportContent] = useState('');
//   const navigation = useNavigation();

//   // URL 안전성 확인 함수
//   const handleUrlSafetyCheck = async (inputUrl: string) => {
//     try {
//       const response = await axios.post('YOUR_API_ENDPOINT', { url: inputUrl });
//       const isSafe = response.data.isSafe; // Assuming your API returns this field

//       if (isSafe) {
//         Alert.alert('안전한 사이트입니다!', '링크로 이동합니다.', [
//           { text: 'OK', onPress: () => openUrl(inputUrl) }
//         ]);
//       } else {
//         Alert.alert(
//           '주의!',
//           '이 사이트는 피싱 사이트일 수 있습니다.',
//           [
//             { text: '알겠습니다', onPress: () => {} },
//             { text: '대처 방법', onPress: showPhishingGuide }
//           ],
//           { cancelable: false }
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('오류', 'URL 확인 중 오류가 발생했습니다.');
//     }
//   };

//   // URL을 실제로 열기
//   const openUrl = (inputUrl: string) => {
//     Linking.openURL(inputUrl).catch(err => console.error('Failed to open URL:', err));
//   };

//   // 피싱 대처 방법 안내
//   const showPhishingGuide = () => {
//     Alert.alert(
//       '피싱 공격 대처 방법',
//       '1. 사이트 주소가 정확한지 확인하세요.\n2. 의심스러운 링크를 클릭하지 마세요.\n3. 웹사이트가 HTTPS로 시작하는지 확인하세요.\n4. 로그인 정보나 개인 정보를 요청하는 사이트는 의심스러운 사이트일 수 있습니다.',
//       [{ text: '알겠습니다' }]
//     );
//   };

//   // 신고 제출 함수
//   const handleReportSubmit = () => {
//     if (!reporterName || !reporterContact || !scannedData || !reportContent) {
//       Alert.alert('모든 필드를 작성해주세요!');
//       return;
//     }

//     // 신고 데이터를 서버에 전송하거나 로컬에서 처리하는 로직 추가
//     console.log({
//       reporterName,
//       reporterContact,
//       scannedData,  // 스캔된 정보
//       reportContent,
//     });

//     Alert.alert('신고가 접수되었습니다. 감사합니다!');
//     setReporterName('');
//     setReporterContact('');
//     setReportContent('');
//   };

//   return (

//     <ScrollView contentContainerStyle={commonStyles.container}>
//       <View style={commonStyles.headerContainer}>
//       <Header onBackPress={() => navigation.goBack()} />

//         <Text style={commonStyles.headerTitle}>신고하기!</Text>
//         </View>


//       {/* URL 검사 입력 */}
//       <View style={commonStyles.formContainer}>
//         <View style={commonStyles.innerContainer}>
//         <Text style={commonStyles.text1}>검사할 URL을 입력하세요.</Text>
//         <TextInput
//           style={commonStyles.input}
//           placeholder="URL을 입력하세요."
//           value={url}
//           onChangeText={setUrl}
//         />
//         <HEButton title="URL 검사" onPress={() => handleUrlSafetyCheck(url)} />
//         <Text style={commonStyles.text2}>
//           {'\n'}피싱 공격에 대비하여 URL을 확인하고 안전성을 검사하세요.
//         </Text>
//       </View>

//       {/* 스캔된 정보 표시 */}
//       {scannedData && (
//         <View style={commonStyles.scannedInfo}>
//           <Text style={commonStyles.label}>스캔된 정보:</Text>
//           <Text>{scannedData}</Text>
//         </View>
//       )}

//       {/* 신고자 정보 입력 */}
//       <Text style={commonStyles.label}>신고자 이름</Text>
//       <TextInput
//         style={commonStyles.input}
//         placeholder="이름을 입력하세요"
//         value={reporterName}
//         onChangeText={setReporterName}
//       />

//       <Text style={commonStyles.label}>연락처 (이메일 또는 전화번호)</Text>
//       <TextInput
//         style={commonStyles.input}
//         placeholder="연락처를 입력하세요"
//         value={reporterContact}
//         onChangeText={setReporterContact}
//       />

//       <Text style={commonStyles.label}>피싱 의심 내용</Text>
//       <TextInput
//         style={[commonStyles.input, commonStyles.textArea]}
//         placeholder="피싱에 대한 의심을 설명해주세요"
//         multiline
//         numberOfLines={4}
//         value={reportContent}
//         onChangeText={setReportContent}
//       />

//       <HEButton title="신고하기" onPress={handleReportSubmit} />

//       <Text style={commonStyles.text2}>
//         {'\n'}피싱 사이트를 발견하셨다면 신고를 통해 다른 사용자를 보호해주세요.
//       </Text>
//       </View>
      
//     </ScrollView>
 
//   );
// };

// export default Report;



// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';

// type ReportProps = {
//   scannedData: string | null;  // QR 코드로 스캔된 정보 (전화번호, URL 등)
// };

// const Report: React.FC<ReportProps> = ({ scannedData }) => {
//   const [reporterName, setReporterName] = useState('');
//   const [reporterContact, setReporterContact] = useState('');
//   const [reportContent, setReportContent] = useState('');

//   const handleReportSubmit = () => {
//     if (!reporterName || !reporterContact || !scannedData || !reportContent) {
//       Alert.alert('모든 필드를 작성해주세요!');
//       return;
//     }

//     // 신고 데이터를 서버에 전송하거나 로컬에서 처리하는 로직 추가
//     console.log({
//       reporterName,
//       reporterContact,
//       scannedData,  // 스캔된 정보
//       reportContent,
//     });

//     Alert.alert('신고가 접수되었습니다. 감사합니다!');
//     setReporterName('');
//     setReporterContact('');
//     setReportContent('');
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>피싱 신고하기</Text>
      
//       {/* 스캔된 정보 표시 */}
//       {scannedData ? (
//         <View style={styles.scannedInfo}>
//           <Text style={styles.label}>스캔된 정보:</Text>
//           <Text>{scannedData}</Text>
//         </View>
//       ) : (
//         <Text style={styles.label}>QR 코드에서 정보를 스캔해 주세요.</Text>
//       )}
      
//       <Text style={styles.label}>신고자 이름</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="이름을 입력하세요"
//         value={reporterName}
//         onChangeText={setReporterName}
//       />
      
//       <Text style={styles.label}>연락처 (이메일 또는 전화번호)</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="연락처를 입력하세요"
//         value={reporterContact}
//         onChangeText={setReporterContact}
//       />
      
//       <Text style={styles.label}>피싱 의심 내용</Text>
//       <TextInput
//         style={[styles.input, styles.textArea]}
//         placeholder="피싱에 대한 의심을 설명해주세요"
//         multiline
//         numberOfLines={4}
//         value={reportContent}
//         onChangeText={setReportContent}
//       />
      
//       <Button title="신고하기" onPress={handleReportSubmit} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#333',
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingLeft: 8,
//     borderRadius: 4,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   scannedInfo: {
//     marginBottom: 20,
//     padding: 10,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 8,
//   },
// });

// export default Report;
